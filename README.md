# Watts up - Energy sources city builder simulator

![Screenshot of Watts up](https://github.com/Vaakir/24h-hackaton-equinor/blob/main/docs/Screenshot2.png)

## Overview
**Watts up**, the Watts up Game is an interactive application designed to help people learn and explore the effect of different energy sources on GDP, production, consumption and how they are affected by the amount of sunshine and wind.

We used realistic wind and sunshine data gathered from `yr.no` and realistic produciton and costs from `https://www.nve.no/energi/analyser-og-statistikk/kostnader-for-kraftproduksjon/`.

As a Game with a Purpose (GWAP), Watts up not only provides entertainment but also contributes to increased awareness of each energy source's strengths and weaknesses.

## Notes
- Use mouse to zoom, pan, click on buildings and then on the canvas to build. Press escapte to pause. Enjoy!

## Installation

### Prerequisites
- Python

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Vaakir/24h-hackaton-equinor/tree/main/docs
   cd 24h-hackaton-equinor
   ```

3. Start the application:
   **For Windows:**
      In the console, simply run > `python launch.py` or `run the launch.py file in Visual Studio Code` 

   The application is then automatically opened at:
      http://localhost:8001/

### Architecture:
We drew inspiration from the `entity-component` software architecture which is commonly used for development of video games. 

### CODE - TODO (our excuse)
Due to a lack of time (and sleep) (we did this in 12hours) (and experience) we had to compromise on code readability and scalability to deliver a workable product.
This means we did not implement components, some css is written in .js, some .js was implemented in the .html and some values were hardcoded. In the end, we're extremely happy we got this far, but for further development, a through cleanup would be necessary. 

The competition was harsh, but our group ran away with the price and the fame, well done everyone!
![Picture of hackaton contenders](https://github.com/Vaakir/24h-hackaton-equinor/blob/main/docs/winners.jpg)
