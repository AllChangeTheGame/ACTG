from collections import defaultdict
from typing import Dict, List, Set, Tuple
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.routes import get_route_from_db
from app.api.routes.sites import get_site_from_db
from app.db.session import yield_db

router = APIRouter()


def find_longest_connected_path(route_claims: List[models.RouteClaim], db: Session) -> float:
    """
    Calculate the longest connected path through the claimed routes using DFS with backtracking.

    This is the longest path problem which is NP-hard, but practical for the small number of routes
    a team typically claims (10-50 routes).

    Args:
        route_claims: List of route claims for a team
        db: Database session

    Returns:
        Length of the longest connected path in km
    """
    if not route_claims:
        return 0

    if len(route_claims) == 1:
        # Single route - just return its distance
        return get_route_from_db(route_claims[0].route_id, db).distance

    # Build adjacency graph: city_id -> [(neighbor_city_id, route_distance, route_id)]
    graph: Dict[UUID, List[Tuple[UUID, float, UUID]]] = defaultdict(list)
    route_map: Dict[UUID, float] = {}

    for route_claim in route_claims:
        route = get_route_from_db(route_claim.route_id, db)
        route_map[route.id] = route.distance

        # Add bidirectional edges (trains can go both ways)
        graph[route.start_city_id].append((route.end_city_id, route.distance, route.id))
        graph[route.end_city_id].append((route.start_city_id, route.distance, route.id))

    def dfs(current_city: UUID, visited_routes: Set[UUID], current_distance: float) -> float:
        """
        DFS with backtracking to find the longest path.

        Args:
            current_city: Current city we're at
            visited_routes: Set of route IDs we've already used in this path
            current_distance: Total distance accumulated so far

        Returns:
            Maximum distance achievable from this point
        """
        max_distance = current_distance

        # Try each neighboring city
        for neighbor_city, route_distance, route_id in graph[current_city]:
            if route_id not in visited_routes:
                # Mark this route as visited
                visited_routes.add(route_id)

                # Recursively explore from the neighbor
                distance = dfs(neighbor_city, visited_routes, current_distance + route_distance)
                max_distance = max(max_distance, distance)

                # Backtrack: unmark this route
                visited_routes.remove(route_id)

        return max_distance

    # Try starting from each city and find the maximum
    max_path_length = 0
    all_cities = list(graph.keys())

    for start_city in all_cities:
        path_length = dfs(start_city, set(), 0)
        max_path_length = max(max_path_length, path_length)

    return max_path_length


def calculate_team_claimed_distance(team: schemas.Team, db: Session) -> int:
    route_claims = (
        db.query(models.RouteClaim).filter(models.RouteClaim.team_id == team.id, models.RouteClaim.is_active).all()
    )

    # Calculate longest connected path through claimed routes instead of summing all routes
    longest_path_distance = find_longest_connected_path(route_claims, db)

    bonus_site_claims = (
        db.query(models.BonusSiteClaim)
        .filter(models.BonusSiteClaim.team_id == team.id, models.BonusSiteClaim.is_active)
        .all()
    )
    site_distance = [
        get_site_from_db(bonus_site_claim.site_id, db).site_value for bonus_site_claim in bonus_site_claims
    ]

    # Get distance adjustments (can be positive or negative)
    distance_adjustments = (
        db.query(models.DistanceAdjustment)
        .filter(models.DistanceAdjustment.team_id == team.id, models.DistanceAdjustment.is_active)
        .all()
    )
    adjustments_total = sum([adjustment.adjustment_km for adjustment in distance_adjustments])

    # Use longest path instead of sum of all routes, then add bonuses
    team_distance = longest_path_distance + sum(site_distance) + adjustments_total

    return int(team_distance)


@router.get("/claimed-distance/", response_model=list[schemas.ClaimedDistance])
def get_claimed_distance(db: Session = Depends(yield_db)):
    teams = db.query(models.Team).all()

    claimed_distances = []

    for team in teams:
        team_distance = calculate_team_claimed_distance(team, db)

        claimed_distance = schemas.ClaimedDistance(
            team_id=team.id,
            team_name=team.name,
            claimed_distance=team_distance,
        )

        claimed_distances.append(claimed_distance)

    return claimed_distances


@router.get("/claimed-distance/{team_id}/", response_model=schemas.ClaimedDistance)
def get_team_claimed_distance(team_id: UUID, db: Session = Depends(yield_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    team_distance = calculate_team_claimed_distance(team, db)

    claimed_distance = schemas.ClaimedDistance(
        team_id=team.id,
        team_name=team.name,
        claimed_distance=team_distance,
    )

    return claimed_distance
