This Project is to get the Nutri Values from USDN DB.

#Version : Init - Base 0.2

#Whats New
Fixed #1: Search for Fod product is better now , taking the mist appropriate result (still need to be improvized) Issue#1
Fixed #2: JSON format data extracted and formed from the response. 

#How it Works
Bascially it uses two API calls one for the search for food and other is to get the Nutrient Values

#Known Issues:
1. (Solved) Food Search Returns Multiple results , We've just picked the first item for this run
2. (Solved) Though All Nutrients are retrived , only Energy is displayed at this moment to have better Parsing capabilities 
3. When searching , the cache need to be reinit as the result is displayed only after second search, So for every subsequent result it is trying to get details from previous run/session. 
