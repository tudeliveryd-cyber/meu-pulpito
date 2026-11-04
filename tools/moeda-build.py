# Genera js/moeda.js: zona horaria -> moneda local (para mostrar el precio en la moneda de cada país)
# Fuentes: tzdb zone.tab (dominio público) y datos CLDR vía Babel (territorio -> moneda)
import json,os
from babel.numbers import get_territory_currencies
from datetime import date
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','js','moeda.js')
tz={}
for f in ('/usr/share/zoneinfo/zone.tab',):
    for l in open(f):
        if l.startswith('#'):continue
        p=l.split('\t');cc,z=p[0],p[2].strip()
        c=get_territory_currencies(cc,date.today(),tender=True)
        if c:tz[z]=c[0]
# alias habituales que el navegador puede devolver
AL={'America/Buenos_Aires':'ARS','America/Cordoba':'ARS','Asia/Calcutta':'INR','Asia/Saigon':'VND','Asia/Katmandu':'NPR','Asia/Rangoon':'MMK','Europe/Kiev':'UAH','America/Godthab':'DKK','Atlantic/Faeroe':'DKK','US/Eastern':'USD','US/Central':'USD','US/Mountain':'USD','US/Pacific':'USD','Brazil/East':'BRL','America/Indianapolis':'USD','America/Louisville':'USD'}
tz.update({k:v for k,v in AL.items() if k not in tz})
# comprimir: moneda -> lista de zonas
inv={}
for z,c in sorted(tz.items()):inv.setdefault(c,[]).append(z)
js="/* Moneda local por zona horaria (tzdb + CLDR). Generado por tools/moeda-build.py */\nwindow.MP_TZCUR="+json.dumps(inv,separators=(',',':'))+";\n"
js+=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'moeda-fn.js')).read()
open(OUT,'w').write(js);open(os.path.join(os.path.dirname(OUT),'..','app','moeda.js'),'w').write(js);print(len(tz),'zonas',len(inv),'monedas',len(js),'bytes')
