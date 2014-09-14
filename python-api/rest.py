import os
from flask import Flask
import psycopg2, json
import urlparse
import urllib2

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'

def connect_postgres():
    DATABASE_URL='postgres://sasmnngaqrihbn:esUP1N1fatVoZmdj22YrHf1SWW@ec2-54-195-241-195.eu-west-1.compute.amazonaws.com:5432/d6msnp94rlfqml'
    
    urlparse.uses_netloc.append('postgres')
    if False and 'DATABASE_URL' in os.environ and os.environ['DATABASE_URL'].startswith('postgres'):
        DATABASE_URL = os.environ['DATABASE_URL']
    else:
        DATABASE_URL = 'postgres://sasmnngaqrihbn:esUP1N1fatVoZmdj22YrHf1SWW@ec2-54-195-241-195.eu-west-1.compute.amazonaws.com:5432/d6msnp94rlfqml'
    url = urlparse.urlparse(DATABASE_URL)
    
    return psycopg2.connect("dbname=%s user=%s password=%s host=%s " % (url.path[1:], url.username, url.password, url.hostname))

def select_query(query):
    conn = connect_postgres()
    cur = conn.cursor()
    cur.execute(query)
    rows = cur.fetchall()
    conn.close()
    return rows

columns = [
    'LA_id',
    'LA_name',
    'region',
    'households',
    'pv_total',
    'wind_total',
    'hydro_total',
    'anaerobic_total',
    'chp_total',
    'total_capacity',
    'percent_fuel_poor',
    'national_rank',
    'regional_rank'
]

openlylocal_ids = {"29UL": 373, "00MA": 43, "29UH": 74, "29UK": 130, "29UD": 54, "29UG": 62, "29UN": 102, "00ML": 45, "00MS": 377, "00MR": 353, "00MW": 298, "42UE": 124, "24": 284, "21": 262, "23": 278, "23UB": 152, "00MD": 90, "29": 68, "23UE": 61, "00FF": 111, "00FB": 261, "43UJ": 399, "00FA": 294, "00FN": 303, "32UC": 56, "32UD": 306, "00FK": 117, "32UG": 94, "31UB": 42, "12UG": 92, "31UH": 341, "29UC": 48, "00EJ": 168, "12UE": 66, "12UB": 214, "00EM": 329, "16UB": 38, "16UF": 263, "00EF": 393, "16UD": 114, "00EX": 112, "00EQ": 146, "00EW": 147, "00EU": 140, "00ET": 63, "21UH": 105, "24UD": 55, "24UF": 279, "00HX": 100, "00HY": 107, "29UP": 410, "32UE": 79, "00HD": 93, "00HE": 53, "18UC": 59, "00HB": 149, "36UG": 88, "00HG": 84, "36UF": 368, "00NE": 52, "47UG": 437, "00NS": 82, "38": 81, "17UH": 291, "17UG": 58, "31": 72, "30": 301, "47UD": 86, "34": 126, "00GA": 64, "41UC": 120, "41UD": 156, "00GL": 96, "00QS": 277, "44UE": 97, "23UG": 101, "00QD": 39, "00QA": 37, "00BB": 13, "00BC": 14, "00BA": 1, "00BF": 4, "00BG": 16, "00BD": 35, "00BE": 15, "00BJ": 2, "00BK": 36, "00BH": 17, "00BN": 157, "00BL": 113, "00BR": 369, "00BW": 427, "00BU": 414, "00BZ": 99, "15UH": 67, "00BX": 69, "00BY": 73, "00PT": 215, "00PP": 158, "33UB": 44, "38UE": 103, "00PH": 76, "00AG": 23, "00AF": 22, "00AE": 21, "00AD": 5, "00AC": 20, "00AB": 19, "00AN": 29, "00AM": 7, "00AL": 28, "00AK": 6, "00AJ": 26, "00AH": 25, "00AW": 33, "33": 328, "00AU": 32, "00AT": 10, "00AS": 31, "00AR": 30, "00AQ": 9, "00AP": 8, "00AZ": 34, "00AY": 12, "00AX": 11, "00KA": 123, "00KC": 145, "00KB": 144, "43UF": 357, "43UB": 265, "26UK": 418, "26UG": 98, "26UE": 65, "11": 47, "22UH": 57, "00DA": 71, "00DB": 104, "42": 397, "22UB": 40, "41": 95, "95Z": 41, "30UK": 85, "30UH": 70, "30UE": 51, "11UE": 91, "00RH": 177, "00CW": 143, "00CM": 134, "00CN": 167, "38UB": 49, "38UC": 350, "00CJ": 77, "00JA": 83, "00CF": 87, "00CA": 89, "00CB": 108, "00CU": 139, "47UB": 46, "47UC": 75, "00CQ": 116, "47UE": 109, "47UF": 110, "00CR": 118}

def get_twitter_handle(LA_id):
    try:
        url = 'http://openlylocal.com/councils/%s.json' % openlylocal_ids[LA_id]
        result = json.loads(urllib2.urlopen(url).read())
        if "twitter_account" in result["council"]:
            return result["council"]["twitter_account"].get("name",None)
        else:
            return None
    except:
        return None

@app.route('/data/council/<LA_id>', methods = ['GET'])
def get_LA_data(LA_id):
    conn = connect_postgres()
    cur = conn.cursor()
    cur.execute("SELECT * FROM local_area WHERE LA_id = '%s'" % LA_id)
    row = [item.strip() if isinstance(item,(str,unicode)) else item for item in cur.fetchone()]
    output_dict = dict(zip(columns,row))
    output_dict['twitter_username'] = get_twitter_handle(LA_id)
    conn.close()
    return json.dumps(output_dict,indent=4)

@app.route('/data/region/<region>', methods = ['GET'])
def get_region_data(region):
    conn = connect_postgres()
    cur = conn.cursor()
    cur.execute("SELECT *, total_capacity/households::float as kw_per_household FROM local_area WHERE region = '%s' ORDER BY total_capacity/households::float DESC" % region)
    output_list = []
    for row in cur.fetchall():
        row = [item.strip() if isinstance(item,(str,unicode)) else item for item in row]
        row_dict = dict(zip(columns+['kw_per_household'],row))
        output_list.append(row_dict)
    conn.close()
    return json.dumps(output_list,indent=4)

@app.route('/data/uk', methods = ['GET'])
def get_uk_data():
    conn = connect_postgres()
    cur = conn.cursor()
    cur.execute("SELECT *, total_capacity/households::float as kw_per_household FROM local_area ORDER BY total_capacity/households::float DESC")
    output_list = []
    for row in cur.fetchall():
        row = [item.strip() if isinstance(item,(str,unicode)) else item for item in row]
        row_dict = dict(zip(columns+['kw_per_household'],row))
        output_list.append(row_dict)
    conn.close()
    return json.dumps(output_list,indent=4)

@app.route('/data/council/<LA_id>/energy_mix', methods = ['GET'])
def get_energy_mix(LA_id):
    query = "SELECT * FROM local_area WHERE LA_id = '%s'" % LA_id
    res = select_query(query)[0]
    res = dict(zip(columns,res))
    output_dict = {
        "LA_id":res['LA_id'],
        "LA_name":res['LA_name'],
        "national_rank":res["national_rank"],
        "units": "kW per household",
        "items":[
            {
                "label":"solar photovoltaic",
                "y": (res['pv_total']+0.0)/(res['households']+0.0)
            },
            {
                "label":"wind",
                "y": (res['wind_total']+0.0)/(res['households']+0.0)
            },
            {
                "label":"hydro",
                "y": (res['hydro_total']+0.0)/(res['households']+0.0)
            },
            {
                "label":"anaerobic digestion",
                "y": (res['anaerobic_total']+0.0)/(res['households']+0.0)
            },
            {
                "label":"CHP",
                "y": (res['chp_total']+0.0)/(res['households']+0.0)
            }
        ]
    }
    return json.dumps(output_dict,indent=4)

@app.route('/data/council/<LA_id>/energy_mix_comparison', methods = ['GET'])
def one_to_beat(LA_id):
    query = '''
        SELECT LA_id, national_rank
        FROM local_area
        WHERE region = (
            SELECT region FROM local_area
            WHERE LA_id = '%s'
        )
        ORDER BY regional_rank
        LIMIT 1;
    ''' % (LA_id)
    row = select_query(query)[0]
    id_to_beat = row[0].strip()
    national_rank = row[1]
    print national_rank
    if id_to_beat==LA_id:
        if national_rank==1:
            return "You're the top!"
        else:
            query = '''
                SELECT LA_id
                FROM local_area
                WHERE national_rank < %s
                ORDER BY national_rank DESC
                LIMIT 1;
            ''' % national_rank
            id_to_beat = select_query(query)[0][0]
            print id_to_beat
    return get_energy_mix(id_to_beat)