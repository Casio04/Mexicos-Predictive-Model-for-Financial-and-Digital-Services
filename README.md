# Mexico's Predictive Model for Financial and Digital Services - 2020
A project made by [Rodrigo Guarneros](https://github.com/RodGuarneros), [Samuel Cerón](https://github.com/samuelceron), [Eduardo Ayala](https://github.com/ayalaeduardo95) and [Carlos Casio](https://github.com/Casio04)

## Overview
This web application is the second stage from our previous project ([Mexico's Digital Inclusion 2020](https://github.com/Casio04/Mexico-digital-inclusion-2020)) where we were able to see which states are digitally behind or leading the country's transformation. However, as the same source (Census 2020 by INEGI) had more useful information we could grab, we decided to look up for reltaionships between the digital and financial services. We had some inital questions that lead us into data exploration:

* Does every family with an internet service also owns a computer?
* Does every family paying for a streaming service owns also a TV to watch it?
* What is the most commonly used credit in the country?
* What is the relationship between variables? For example, how is the internet service affected by the increase or decrease of other services?

And the most important one:
* **How can we predict the behavior of a service in the future if we were to start a business? Where can we invest?**

## Contents
1. Background. 
   1. Here we show historical information for most of the digital and banking services since 2011, with the only purpose to start digging on their behavior. You can compare graphs from different financial services and see how some of them have really stopped being used, like L1 and L2 accounts (explained in detail on the State view), and some that have had an exponential growth, like ATM's and Points of Sale (PoS) 

2. National Overview.
   1. With the helpf of Tableau Public, we show 2 maps and one scatter plot, with the purpose of searching for meaningful relationships between two services on different states in Mexico. After only 2 or 3 minutes of exploration, you will be able to find at least two curious relationships (and maybe you should remember them for the next part)

3. State detail.
   1. On this page, we have a map by state where we can select which type of services we want to look at (Digital, Financial, Savings and Loans). Each option includes an explanation of each service included. After we pick both options (State and Type of Service) we will see the average density of the services in that state, with some extra information on the right corner of the map, in the tooltip.
   2. Additionaly, there are two other filters linked to the grapsh below on the same page. You can choose if you want to look at the information by Municipality, where you will see each service of that municipality and their behavior, or you can select a service that will be shown for all the municipalities. In that way, it doesn't matter if you are interested in looking on only one service or the whole state, you can check both options and stay with the one that suits you best.

4. Machine Learning model.
   1. After some exploration of data and using some statistics techinques (look at the "Machine Learning process" section), we ended up with 5 relevant variables (services). They were considered relevant because of the percentage the other variables could explain for the main one. 
   2. There is a step-by-step guide on the web application that you can follow, but to be short, you can pick one of those 5 relevant variables, a state and a municipality.
   3. First, the model will show updated values of correlation for the significant variables to that main service, per instance, if you pick Credit Card and you see below a 0.50 on PC, it would mean that, for every two Credit Cards issued, there is one PC purchase on that specific municipality.
   4. Then, you can change either of the variables shown below to see a prediction of how the main service will be affected. For example, I can imagine that if I increase the Internet sales (the explanator variable) by 10%, the Streaming Services (the main variable for the model) will also increase. Therefore, I modify the number by 10% more and click on Calculate. You can change any number of variables you want on a simple calculation.
   5. Finally, you will see on the right side of the screen (or below on a cellphone) the results for the prediction, with a little advice. Further below you can see a little explanation and extra information about the Machine Learning Model and how we did it.

## Machine Learning process
The process to build the model includes the following steps: 
* Read the json file with every feature for each municipality.
* Feature analysis, based on:
* Cleaning data process; 
* Exploratory data analysis for each feature regarding digital and financial services, and 
* Correlation analysis to give an indication of how related the changes are between two variables.
* Feature reduction using Principal Component Analysis (PCA)
* Normalize the dataset because PCA method is sensible to the scale.
* Apply PCA method and reduce the dataframe with the principal components value for all municipalities.
* Apply a ML regression model based on the dataset previously reduced for the best variables the PCA gave us (Credit cards, debit cards, mobile banking contracts, households with PC and streaming services)
* Train-Test Split
* Train the model
* Test the model
* Save the model
* Load the model ready to be inserted in the web application

## Technologies used
* Backend
  * Flask

* Database
  * MongoDB Atlas

* Frontend
  * HTML
  * CSS
  * JavaScript
  * D3.js
  * Plotly.js
  * Leaflet.js
  * Tableau Public

* Programming language
  * Python
  * Scikit-learn (ML Model)

# Usage
The final Web Application is available for free use in the following [Heroku Deploy](https://financial-inclusion.herokuapp.com/index.html)

## Outcomes
Landing page

![Landing](/static/img/Home.jpg)


Historic background

![Historic](/static/img/background.jpg)


National Overview

![National](/static/img/national.jpg)


State Detail

![State](/static/img/State.jpg)


Machine Learning Model

![ML](/static/img/ML.jpg)


About

![About](/static/img/about.jpg)

# Sources
All the data used can be found on the [Official INEGI website](https://www.inegi.org.mx/programas/ccpv/2020/#:~:text=El%20Censo%20de%20Poblaci%C3%B3n%20y,viviendas%20para%20obtener%20informaci%C3%B3n%20sobre)
