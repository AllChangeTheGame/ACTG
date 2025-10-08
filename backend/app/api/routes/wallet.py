from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.teams import get_team_from_db, get_user_from_db
from app.db.session import yield_db
from app.models.distance_adjustments import AdjustmentReason
from app.models.wallet import ReasonCategory
from app.utils import get_user_id_from_authorization

router = APIRouter()


@router.get("/wallet/balance", response_model=schemas.WalletBalance)
def get_wallet_balance(authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header required")

    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    team = get_team_from_db(user.team_id, db)

    balance = team.wallet_euros if team.wallet_euros is not None else Decimal("0")
    return schemas.WalletBalance(team_id=team.id, balance=balance)


@router.post("/wallet/transact", response_model=schemas.WalletTransaction)
def create_transaction(
    transaction_data: schemas.WalletTransactionCreate,
    authorization: Annotated[str | None, Header()],
    db: Session = Depends(yield_db),
):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header required")

    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    team = get_team_from_db(user.team_id, db)

    # Calculate new balance
    current_balance = team.wallet_euros if team.wallet_euros is not None else Decimal("0")
    new_balance = current_balance + transaction_data.amount

    # Create transaction record
    wallet_transaction = models.WalletTransaction(
        team_id=team.id,
        user_id=user.id,
        amount=transaction_data.amount,
        reason_category=transaction_data.reason_category,
        reason=transaction_data.reason,
        wallet_balance_after=new_balance,
    )

    # Update team wallet balance
    team.wallet_euros = new_balance

    db.add(wallet_transaction)
    db.commit()
    db.refresh(wallet_transaction)

    return wallet_transaction


@router.get("/wallet/transactions", response_model=list[schemas.WalletTransaction])
def get_transaction_history(authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header required")

    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    team = get_team_from_db(user.team_id, db)

    transactions = (
        db.query(models.WalletTransaction)
        .filter(models.WalletTransaction.team_id == team.id, models.WalletTransaction.is_active.is_(True))
        .order_by(desc(models.WalletTransaction.create_time))
        .all()
    )

    return transactions


@router.get("/wallet/reason-categories", response_model=list[schemas.ReasonCategoryResponse])
def get_reason_categories():
    return [
        schemas.ReasonCategoryResponse(value=category.value, label=category.label, type=category.transaction_type)
        for category in ReasonCategory
    ]


@router.post("/wallet/exchange_distance", response_model=schemas.ExchangeDistanceResponse)
def exchange_distance_for_money(
    authorization: Annotated[str | None, Header()],
    db: Session = Depends(yield_db),
):
    """Exchange 200km of distance for 100 euros.

    Creates a distance adjustment of -200km and adds 100 euros to the wallet.
    """
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header required")

    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    team = get_team_from_db(user.team_id, db)

    # Constants for the exchange
    DISTANCE_TO_DEDUCT = -200  # negative because we're removing distance
    MONEY_TO_ADD = Decimal("100.00")

    # Calculate new wallet balance
    current_balance = team.wallet_euros if team.wallet_euros is not None else Decimal("0")
    new_balance = current_balance + MONEY_TO_ADD

    # Create distance adjustment record
    distance_adjustment = models.DistanceAdjustment(
        team_id=team.id,
        user_id=user.id,
        adjustment_km=DISTANCE_TO_DEDUCT,
        reason_category=AdjustmentReason.DISTANCE_FOR_MONEY,
        reason="Exchanged 200km for 100 euros",
    )

    # Create wallet transaction record
    wallet_transaction = models.WalletTransaction(
        team_id=team.id,
        user_id=user.id,
        amount=MONEY_TO_ADD,
        reason_category=ReasonCategory.DISTANCE_EXCHANGE,
        reason="Exchanged 200km for 100 euros",
        wallet_balance_after=new_balance,
    )

    # Update team wallet balance
    team.wallet_euros = new_balance

    # Add both records to database
    db.add(distance_adjustment)
    db.add(wallet_transaction)
    db.commit()
    db.refresh(distance_adjustment)
    db.refresh(wallet_transaction)

    return schemas.ExchangeDistanceResponse(
        adjustment_id=distance_adjustment.id,
        adjustment_km=DISTANCE_TO_DEDUCT,
        wallet_transaction_id=wallet_transaction.id,
        wallet_amount=float(MONEY_TO_ADD),
        new_wallet_balance=float(new_balance),
    )
