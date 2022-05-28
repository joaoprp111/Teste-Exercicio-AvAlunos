import requests

#Aquecimento 

with open('apiKey.txt') as f:
    apikey = f.read()

#1
content = requests.get('http://clav-api.di.uminho.pt/v2/legislacao?apikey=' + apikey)
numDiplomasCatalogados = len(content.json())
print('1: ',numDiplomasCatalogados)

#2
count2 = 0
for d in content.json():
    if d['tipo'] == 'Despacho':
        count2 += 1
print('2: ',count2)

#3 
id = ''
for d in content.json():
    if d['numero'] == '28/2016':
        id = d['id']
        break

content = requests.get('http://clav-api.di.uminho.pt/v2/legislacao/' + id + '/processos?apikey=' + apikey)
print('3: ',content.json())

#4
count4 = 0
content = requests.get('http://clav-api.di.uminho.pt/v2/legislacao?info=completa&apikey=' + apikey)
for d in content.json():
    processosRelacionados = d['regula']
    for p in processosRelacionados:
        if p['id'] == 'c300.10.001':
            count4 += 1

print('4: ',count4)
