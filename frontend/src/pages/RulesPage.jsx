import 'react-tabs/style/react-tabs.css';
import './RulesPage.css';

function RulesPage() {

  return (
    <><div className='rulesPage'>
      <h2 className='titleR'>Routes - special rules</h2>
        <p className='subtitleR'>All routes to, from and within Germany are 0.7x the ticket price quoted online</p>
        <p>Free Routes - Any routes that are 100km or less are free, and do not cost money from the bank. These routes still need to start in a city that you have completed a challenge in (if you have not used a ‘skip’).</p>
        <table>
  <tr>
    <th>Route</th>
    <th>Minimum price (per team)</th>
  </tr>
  <tr>
    <td>Lille - Paris</td>
    <td>€110</td>
  </tr>
  <tr>
    <td>Lyon - Montpellier</td>
    <td>€100</td>
  </tr>
  <tr>
    <td>Lyon - Marseille</td>
    <td>€120</td>
  </tr>
  <tr>
    <td>Nantes - Paris</td>
    <td>€150</td>
  </tr>
  <tr>
    <td>Paris - Bordeaux</td>
    <td>€300</td>
  </tr>
  <tr>
    <td>Paris - Strasbourg</td>
    <td>€240</td>
  </tr>
  <tr>
    <td>Paris - Lyon</td>
    <td>€220</td>
  </tr>
  <tr>
    <td>Rennes - Paris</td>
    <td>€170</td>
  </tr>
  <tr>
    <td>Tour - Paris</td>
    <td>€90</td>
  </tr>
  <tr>
    <td>Tour - Bordeaux</td>
    <td>€120</td>
  </tr>
</table>   
    </div></>
  )
}

export default RulesPage