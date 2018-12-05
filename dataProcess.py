from random import randrange
import datetime 

def random_date():
    start = datetime.datetime(2018, 10, 24, 10, 00)
    return start + datetime.timedelta(seconds=randrange(60*5*60))

allTimes = []
for i in range(300):
    allTimes.append(random_date())

allTimes.sort();

import json

with open('random_transactions.json') as f:
    data = json.load(f)

allTrans = []

for key in range(0,300, 20):
    for each in data[str(key)]:
        allTrans.append(each)

newTrans = []
i = 0
for tran in allTrans:
    newTran = {}
    newTran["source"] = tran["from"]
    newTran["target"] = tran["to"]
    newTran["value"] = tran["amount"]
    newTran["time"] = allTimes[i]
    i += 1
    newTran["status"] = tran["status"]
    newTrans.append(newTran)
print(allTimes[280:])

result = []
index = 1
i = 0
currentTimeInterval = []
maxValue = 0
minValue = 9223372036854775807
while index <= 60 and i < len(newTrans):
    currentBar = datetime.datetime(2018, 10, 24, 10, 00) + datetime.timedelta(minutes=index*5)
    if newTrans[i]["time"] > currentBar:
        result.append(currentTimeInterval)
        currentTimeInterval = []
        index += 1
    newTrans[i]["time"] = newTrans[i]["time"].strftime("%d/%m/%y %H:%M:%S")
    if newTrans[i]["value"] > maxValue:
        maxValue = newTrans[i]["value"]
    if newTrans[i]["value"] < minValue:
        minValue = newTrans[i]["value"]
    currentTimeInterval.append(newTrans[i])
    i += 1

result.append({"max": maxValue, "min": minValue});
with open('data.json', 'w') as outfile:
    json.dump(result, outfile)
