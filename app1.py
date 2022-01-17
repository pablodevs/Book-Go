import math

weekdays = ['L', 'M', 'X', 'J', 'V']
schedule = ["10:00", "20:30"]
serviceDuration = 45 # minutos

hoursFrom = int(schedule[0].split(':')[0])
minutesFrom = int(schedule[0].split(':')[1])
timeFrom = (hoursFrom * 60 + minutesFrom)
print(f"{hoursFrom}:{minutesFrom}", "-->", f"{hoursFrom * 60 + minutesFrom} mins")

hoursTo = int(schedule[1].split(':')[0])
minutesTo = int(schedule[1].split(':')[1])
timeTo = (hoursTo * 60 + minutesTo)
print(f"{hoursTo}:{minutesTo}", "-->", f"{hoursTo * 60 + minutesTo} mins")

timeInterval = (timeTo - timeFrom)
print(f"interval({timeInterval} mins) / duration({serviceDuration} mins) -->", math.floor(timeInterval / serviceDuration))

for i in range(timeFrom, timeTo, serviceDuration):
    print(f"{math.floor(i / 60)}:{i % 60}")
