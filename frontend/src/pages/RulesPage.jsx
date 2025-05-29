import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './RulesPage.css';

function RulesPage() {
  return (
    <><div className='rulesPage'>
      <h2 className='titleR'>Useful Information</h2>
        <p className='subtitleR'>The game runs from 6am Tuesday 10th October until 10pm Thursday 12th October (CEST). The winning team is the one with the longest, continuous claimed routes at the end of this time.</p>
      <Tabs>
    <TabList>
      <Tab>More rules</Tab>
      <Tab>Bonuses</Tab>
      <Tab>Useful Links</Tab>
      <Tab>Reporting</Tab>
      <Tab>Lists</Tab>
      <Tab>Shop</Tab>
    </TabList>

    <TabPanel>
       <ul>
        <h2>General</h2>
        <li>Teams start with €20 in the bank</li>
        <li>Each team must take a rest period of 9hrs every night, starting between 9pm and 12pm</li>
        <li>Must announce claim within 5 mins of arriving at station</li>
        <li>Bonus Sites give extra 100km</li>
        <h2>Challenge Cards</h2>
        <li>You need to complete at least one card before moving on a route you are claiming.</li>
        <li>You cannot leave a city with a challenge card drawn but not completed or vetoed (unless you have purchased the holster).</li>
        <li>For the avoidance of doubt, you cannot complete any cards whilst travelling between cities. If you complete a challenge outside of the city in which you started the challenge, you must return to that city before starting another route.</li>
        <li>If teams are on the same train, then first to complete a challenge claims the route (this counts as the card draw needed to move on)</li>
        <li>Cards can only be completed in cities, and can only be drawn after 30 minutes before projected arrival of a train that is a claimable route or in the city</li>
        <li>If you've drawn a specific card already drawn in that city, then redraw.</li>
        <li>Challenge cards can be vetoed for a 30 minute penalty, players can move within the city in this time but they must return to the veto position 30 minutes later, and may not draw another card. You cannot veto a card when on a train</li>
        <li>Some cards have time exceptions. If the card is drawn outside the hours on the card, you can re-draw a card. If you draw the card on a train, use the train's projected arrival time at that moment as the "draw time"</li>
          <h2>Challenge card deductions</h2>
          <tr>
            <td>3rd challenge in city</td>
            <td>-10%</td>
          </tr>
          <tr>
            <td>4th challenge in city</td>
            <td>-25%</td>
          </tr>
          <tr>
            <td>5th+ challenge in city</td>
            <td>-50%</td>
          </tr>
        <h2>Costs</h2>
        <li>Costs for transport outside of the main routes (i.e. not covered by interrail pass), and for routes not being claimed (i.e. already claimed) are still are deducted from bank. Transport is public transport only (including bikes/scooters). Intercity travel is via train only.</li>
        <li>Costs for accomodation, food, and for seat reservations do not affect bank</li>
        <h2>Purchasing train tickets</h2>
        <li>When a ticket is "purchased", the arrival time is set at the scheduled/projected arrival time of that train. For every minute (after 15 minutes) that you arrive after that pre-set arrival time at your destination (due exclusively to train delays) you will accrue one minute in a veto bank, that can be used to reduce veto time for future challenge card draws.</li>
        <li>Once a ticket is purchased, it cannot be refunded. If a train is delayed, the ticket can transfer to another train on the same route (same rules apply above even if you change the train you travel on). If the train is cancelled or there is not another train to your destination which will arrive within 90 minutes of your original scheduled/projected arrival time, you may take a refund.</li>
        <h3>If in doubt about any rules, ask on the central Whatsapp group to discuss with all teams</h3>
        </ul>
    </TabPanel>
    <TabPanel>
      <ul>
        <li>€50 gained immediately after crossing a border into a country you have not yet visited.</li>
        <li>€50 gained when you visit a capital city- you must step foot in the city and take a selfie.</li>
        <li>€100 gained immediately if you travel on 4+ modes of public transport in one city - Bike, Scooter, Train (within city, not the arrival train), Metro (underground/subway style system), Tram, Bus, Ferry/Boat.</li>
      </ul>
    </TabPanel>
    <TabPanel>
      <h2>For checking and booking trains</h2>
      <ul>
        <p><a href="https://www.thetrainline.com/">Trainline</a></p>
        <p>Poland - Trainline doesn't carry, so use <a href="https://www.pkp.pl/en/">PKP</a> to determine price</p>
        <p>Czechia - Trainline carries <a href="https://regiojet.com/">Regiojet</a>, which doesn't show on interrail app, but requires seat reservations. These can be made here</p>
        <p>Czechia - Trainline doesn't carry national service, so can use <a href="https://www.cd.cz/en/">CD</a> to determine price</p>
        <p>Slovakia - Trainline doesn't carry national service, so can use <a href="http://www.slovakrail.sk/en.html">SK</a> to determine price</p>
        <p>Slovenia - Trainline doesn't carry national service, so can use <a href="https://shop.oebbtickets.at/en/ticket">OBB</a> to determine price</p>
      </ul>
      <h2>Other links</h2>
      <ul>
        <a href='https://www.generatorslist.com/random/misc/random-choice-generator'>Random Choice Generator</a>
        <br/><br/>
        <a href="https://www.calcmaps.com/map-radius/">Circle drawing tool</a>
        <br/><br/>
        <a href="https://euro-train.com/station/159-hamburg-hbf-hamburg-main-station">Live departure boards</a>
      </ul>
    </TabPanel>
    <TabPanel>
      <tr className='firstRow'>
        <th>Report</th>
        <th>Who to tell</th>
        <th>What do you need to log</th>
      </tr>
      <tr>
        <td>Rest Period</td>
        <td>Other Teams</td>
        <td>Start time, end time, location started</td>
      </tr>
      <tr>
        <td>Bonus Site</td>
        <td>Other Teams</td>
        <td>What time, what site, evidence</td>
      </tr>
      <tr>
        <td>Route Claimed</td>
        <td>Other Teams</td>
        <td>What route, what train (screenshot of purchased train), arrival time, distance</td>
      </tr>
      <tr>
        <td>Draw Card</td>
        <td>No-one</td>
        <td>What time, what card, city</td>
      </tr>
      <tr>
        <td>Veto Card</td>
        <td>No-one</td>
        <td>What time, what card, location, veto bank usage (if any), city</td>
      </tr>
      <tr>
        <td>Complete Card</td>
        <td>No-one</td>
        <td>What time, what card, value of card, evidence of completion, which city</td>
      </tr>
      <tr>
        <td>Buying route ticket</td>
        <td>No-one</td>
        <td>What time, what route, what train (screenshot of purchased train), cost, estimated arrival time</td>
      </tr>
      <tr>
        <td>Buying local transport</td>
        <td>No-one</td>
        <td>What time, what city, cost</td>
      </tr>
      <tr>
        <td>Bonus Money</td>
        <td>No-one</td>
        <td>What time, conditions, evidence, value</td>
      </tr>
      <tr>
        <td>Purchase from shop</td>
        <td>No-one</td>
        <td>What time, what item, money delta</td>
      </tr>
      <tr>
        <td>Purchase Screw You Card</td>
        <td>No-one</td>
        <td>What time, what card, money delta</td>
      </tr>
      <tr>
        <td>Use Screw You Card</td>
        <td>The team(s) you screw over</td>
        <td>What time, what card.</td>
      </tr>
      <tr>
        <td>Delay</td>
        <td>No-one</td>
        <td>What train, real arrival time, veto bank amount</td>
      </tr>
    </TabPanel>
    <TabPanel>
      <div className='listTable'>
      <tr>
        <th className='firstColumn'>Country</th>
        <th>Shot of local spirit</th>
        <th>National Breakfast</th>
        <th>National Dish</th>
        <th>National Dessert</th>
      </tr>
      <tr>
        <td className='firstColumn'>Austria</td>
        <td>Marillenschnaps</td>
        <td>Apfelradln (Apple Rings)</td>
        <td>Wiener Schnitzel</td>
        <td>Apple Strudel</td>
      </tr>
      <tr>
        <td className='firstColumn'>Belgium</td>
        <td>Jenever</td>
        <td>Waffles</td>
        <td>Moules-Frites</td>
        <td>Waffles</td>
      </tr>
      <tr>
        <td className='firstColumn'>Croatia</td>
        <td>Rakija</td>
        <td>Palačinke (pancakes)</td>
        <td>black risotto</td>
        <td>Fritule (donuts)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Czech Republic</td>
        <td>Becherovka</td>
        <td>Rye bread and meat</td>
        <td>vepřo knedlo zelo (roast pork)</td>
        <td>Buchty (sweet filled buns)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Denmark</td>
        <td>Aquavit</td>
        <td>Danish Pastry</td>
        <td>stegt flæsk (fried pork)</td>
        <td>danish pastry</td>
      </tr>
      <tr>
        <td className='firstColumn'>France</td>
        <td>Pastis</td>
        <td>Croissant</td>
        <td>Onion soup</td>
        <td>Crème brûlée</td>
      </tr>
      <tr>
        <td className='firstColumn'>Germany</td>
        <td>Schnaps</td>
        <td>Non discript bread/meat</td>
        <td>Bratwurst</td>
        <td>Gugelhupf (round cake)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Hungary</td>
        <td>Unicum</td>
        <td>Lekváros bukta (buns with jam)</td>
        <td>Goulash</td>
        <td>Dobos torte (cake)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Italy</td>
        <td>Sambuca</td>
        <td>Espresso</td>
        <td>Bolognese</td>
        <td>Tiramisù</td>
      </tr>
      <tr>
        <td className='firstColumn'>Netherlands</td>
        <td>Gin</td>
        <td>Hagelslag</td>
        <td>Erwtensoep (pea soup)</td>
        <td>Poffertjes (pancakes)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Poland</td>
        <td>Vodka</td>
        <td>Kiełbasa</td>
        <td>Pierogi</td>
        <td>Pączki (doughnuts)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Slovakia</td>
        <td>Borovička</td>
        <td>Porridge</td>
        <td>Langoš (fried bread)</td>
        <td>Bublanina (cake with fruit)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Slovenia</td>
        <td>Zganje (schnapps)</td>
        <td>Fresh Bread + Honey</td>
        <td>Štruklji (rolled dumplings)</td>
        <td>Potica (rolled dough Slovenian cake)</td>
      </tr>
      <tr>
        <td className='firstColumn'>Spain</td>
        <td>Pacharán</td>
        <td>Spanish Omelette</td>
        <td>Paella</td>
        <td>Churros</td>
      </tr>
      <tr>
        <td className='firstColumn'>Switzerland</td>
        <td>Absinthe</td>
        <td>Cholermus/Local pancakes</td>
        <td>Fondue</td>
        <td>Zwetgschenwähe (tart)</td>
      </tr>
      </div>
    </TabPanel>
    <TabPanel>
      <tr>
        <td>Buy a screw you card</td>
        <td>€100.00</td>
        <td>You can only hold one, you must use before drawing another</td>
      </tr>
      <tr>
        <td>Reveal the location of another pair</td>
        <td>€100.00</td>
        <td>Location shared for 60 minutes (other team may know, depends on implementation)</td>
      </tr>
      <tr>
        <td>Leave without completing a challenge card</td>
        <td>€150.00</td>
        <td>The train has to stop in the city and you must set foot on the platform. This can cancel an active card without serving a veto period.</td>
      </tr>
      <tr>
        <td>Holster</td>
        <td>€250.00</td>
        <td>You can store one challenge card in the holster and swap with the currently active card at any point.</td>
      </tr>
      <tr>
        <td>Gain €100</td>
        <td>-200km</td>
        <td></td>
      </tr>
    </TabPanel>
  </Tabs>
    </div></>
  )
}

export default RulesPage