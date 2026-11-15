"""Generates realistic dummy members (deterministic) -> data/generated-members.json"""
import json, random
random.seed(42)
N = 336  # + 14 hand-written seeds = 350 members

FEMALE = ["Aanya","Aditi","Ishita","Kavya","Neha","Pooja","Riya","Sneha","Tanvi","Divya","Shreya","Nisha","Anjali","Simran","Zara","Sara","Emma","Olivia","Ava","Mia","Chloe","Grace","Lily","Hannah","Ella","Natalie","Madison","Abigail","Sophie","Isabella","Camila","Lucia","Valentina","Gabriela","Mariana","Daniela","Elena","Jia","Mei","Yuna","Hana","Soo-ah","Linh","Mai","Leila","Nadia","Amara","Zoe","Claire","Rachel","Jessica","Lauren","Megan","Kiara","Tara","Meera","Aarohi","Sana","Ira","Naina","Avni","Pari"]
MALE = ["Aarav","Vihaan","Arnav","Ishaan","Kabir","Rohan","Rahul","Karan","Aditya","Siddharth","Varun","Nikhil","Dev","Yash","Aryan","Neil","Liam","Noah","James","Benjamin","Lucas","Henry","Jack","Owen","Ryan","Nathan","Tyler","Andrew","Matthew","Daniel","Mateo","Diego","Carlos","Javier","Luis","Gabriel","Min-jun","Jin","Kenji","Hiro","Wei","Minh","Omar","Samir","Elijah","Marcus","Jordan","Chris","Ethan","Caleb","Arjun","Vikram","Raj","Sahil","Anish","Krish","Ayaan","Reyansh"]
NB = ["Alex","Sam","Jordan","Riley","Casey","Quinn","Avery","Rowan","Sky","Jamie"]
LAST = ["Sharma","Patel","Reddy","Iyer","Nair","Gupta","Singh","Kapoor","Mehta","Rao","Desai","Joshi","Menon","Bhat","Chopra","Malhotra","Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Wilson","Anderson","Taylor","Thomas","Moore","Martin","Lee","Kim","Park","Nguyen","Tran","Chen","Wang","Liu","Tanaka","Sato","Garcia","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Perez","Sanchez","Rivera","Torres","Flores","Khan","Ali","Hassan","Cohen","Murphy","Kelly","Walker","Hall","Young","King","Wright","Scott","Green","Baker","Adams","Nelson","Hill","Campbell","Mitchell","Roberts"]
GROUPS = {
  "indian": (["Aanya","Aditi","Ishita","Kavya","Neha","Pooja","Riya","Sneha","Tanvi","Divya","Shreya","Nisha","Anjali","Simran","Meera","Aarohi","Sana","Ira","Naina","Avni","Pari","Tara","Kiara","Zara"],
             ["Aarav","Vihaan","Arnav","Ishaan","Kabir","Rohan","Rahul","Karan","Aditya","Siddharth","Varun","Nikhil","Dev","Yash","Aryan","Arjun","Vikram","Raj","Sahil","Anish","Krish","Ayaan","Reyansh","Neil"],
             ["Sharma","Patel","Reddy","Iyer","Nair","Gupta","Singh","Kapoor","Mehta","Rao","Desai","Joshi","Menon","Bhat","Chopra","Malhotra","Verma","Agarwal","Kulkarni","Pillai"]),
  "american": (["Emma","Olivia","Ava","Mia","Chloe","Grace","Lily","Hannah","Ella","Natalie","Madison","Abigail","Sophie","Zoe","Claire","Rachel","Jessica","Lauren","Megan"],
               ["Liam","Noah","James","Benjamin","Lucas","Henry","Jack","Owen","Ryan","Nathan","Tyler","Andrew","Matthew","Daniel","Elijah","Marcus","Chris","Ethan","Caleb"],
               ["Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Wilson","Anderson","Taylor","Thomas","Moore","Martin","Murphy","Kelly","Walker","Hall","Young","King","Wright","Scott","Green","Baker","Adams","Mitchell"]),
  "eastasian": (["Jia","Mei","Yuna","Hana","Soo-ah","Linh","Mai","Ji-woo","Sakura","Lin"],
                ["Min-jun","Jin","Kenji","Hiro","Wei","Minh","Jun","Tae-yang","Kai","Hao"],
                ["Lee","Kim","Park","Nguyen","Tran","Chen","Wang","Liu","Tanaka","Sato","Choi","Huang"]),
  "latino": (["Camila","Lucia","Valentina","Gabriela","Mariana","Daniela","Elena","Isabella","Sofia","Ana"],
             ["Mateo","Diego","Carlos","Javier","Luis","Gabriel","Santiago","Alejandro","Andres","Miguel"],
             ["Garcia","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Perez","Sanchez","Rivera","Torres","Flores","Ramirez"]),
}
HOMETOWNS = ["Seattle","Mumbai","Delhi","Bangalore","Hyderabad","Pune","Chennai","Kolkata","Ahmedabad","Jaipur","Portland","San Francisco","Los Angeles","Chicago","New York","Austin","Boston","Denver","Spokane","Vancouver","Toronto","Seoul","Tokyo","Taipei","Manila","Mexico City","Bogotá","São Paulo","London","Dubai","Lagos","Nairobi","Boise","Salt Lake City","Phoenix","San Diego"]
CITIES = ["Seattle"]*10 + ["Bellevue"]*4 + ["Redmond"]*3 + ["Kirkland"]*2 + ["Tacoma"]*2 + ["Bothell","Issaquah","Renton","Everett","Sammamish","Portland","Vancouver"]
DREAM = ["Barcelona","Paris","Tokyo","Lisbon","London","Amsterdam","Zurich","Vancouver","New York","Sydney","Bali","Copenhagen","Rome","Kyoto","Cape Town","Reykjavik","Seoul","Dubai","Florence","Singapore","Vienna","Prague","Honolulu","Santorini"]
JOBS = ["Software Engineer","Senior Software Engineer","Product Manager","Data Scientist","UX Designer","Product Designer","Nurse","Doctor","Physical Therapist","Pharmacist","Teacher","Professor","Architect","Civil Engineer","Mechanical Engineer","Marketing Manager","Financial Analyst","Accountant","Lawyer","Chef","Barista & Musician","Photographer","Graphic Designer","Entrepreneur","Startup Founder","Research Scientist","Cloud Architect","Sales Executive","HR Manager","Consultant","Dentist","Veterinarian","Journalist","Content Creator","Fitness Coach","Real Estate Agent","Pilot","Biotech Researcher","Game Developer","Environmental Scientist"]
COMPANIES = ["Amazon","Microsoft","Google","Meta","Boeing","Starbucks","Costco","Expedia","Zillow","T-Mobile","Nordstrom","Tableau","Salesforce","a startup","UW Medicine","Seattle Children's","Swedish Medical","REI","Nintendo of America","Adobe"]
INTERESTS = ["music","travel","hiking","outdoors","cooking","food","fitness","yoga","reading","movies","tv","gaming","art","dance","sports","tech","photography","pets","nightlife","fashion","spirituality","volunteering","coffee","writing","nature"]
RAW = {"music":["playing guitar","live concerts","Bollywood music","indie playlists","singing karaoke","piano"],"travel":["weekend getaways","backpacking Europe","road trips","exploring new countries"],"hiking":["Mt. Rainier trails","sunrise hikes","Rattlesnake Ledge","Mailbox Peak"],"outdoors":["camping","kayaking on Lake Union","skiing at Snoqualmie"],"cooking":["experimenting with recipes","baking sourdough","cooking for friends"],"food":["trying new restaurants","street food","Pike Place Market"],"fitness":["the gym","running half marathons","CrossFit","cycling"],"yoga":["morning yoga","hot yoga","meditation retreats"],"reading":["sci-fi novels","self-help books","poetry","mystery thrillers"],"movies":["A24 films","Bollywood movies","Marvel marathons","classic cinema"],"tv":["binge-watching series","anime","true-crime docs"],"gaming":["video games","board game nights","chess"],"art":["painting","museum hopping","pottery classes"],"dance":["salsa","bhangra","hip-hop classes","contemporary dance"],"sports":["Seahawks games","cricket","soccer","basketball","tennis"],"tech":["building side projects","AI and gadgets","hackathons"],"photography":["film photography","street photography","drone shots"],"pets":["their dog","cats","fostering rescue animals"],"nightlife":["Capitol Hill bars","clubbing","rooftop parties"],"fashion":["thrifting","sneaker collecting","styling outfits"],"spirituality":["meditation","temple visits","journaling gratitude"],"volunteering":["food bank shifts","teaching kids","animal shelters"],"coffee":["third-wave coffee shops","latte art","cafe hopping"],"writing":["blogging","writing short stories","journaling"],"nature":["beach walks","gardening","stargazing"]}
VALUES = ["family","honesty","loyalty","respect","ambition","adventure","kindness","humor","faith","independence","growth","creativity"]
GOALS = ["long-term"]*5 + ["marriage"]*4 + ["not sure"]*2 + ["casual"]
PERS = ["introvert","extrovert","ambivert","ambivert"]

used = {"Ananya Sharma","Emily Carter","Priya Nair","Sofia Martinez","Meera Iyer","Hannah Lee","Aisha Khan","Olivia Brooks","Arjun Mehta","Daniel Kim","Rohan Verma","Ethan Walker","Kabir Singh","Sam Rivera"}
out = []
for i in range(N):
    r = random.random()
    gender = "female" if r < 0.5 else "male" if r < 0.96 else "non-binary"
    grp = random.choices(list(GROUPS), weights=[45, 30, 12, 13])[0]
    F, M, L = GROUPS[grp]
    pool = F if gender == "female" else M if gender == "male" else NB
    while True:
        name = f"{random.choice(pool)} {random.choice(L)}"
        if name not in used:
            used.add(name); break
    if gender == "non-binary":
        looking = "any"
    else:
        looking = "any" if random.random() < 0.06 else ("male" if gender == "female" else "female")
    age = max(22, min(42, int(random.gauss(29, 4))))
    height = int(random.gauss(163, 6)) if gender == "female" else int(random.gauss(177, 7)) if gender == "male" else int(random.gauss(170, 7))
    ints = random.sample(INTERESTS, random.randint(3, 6))
    dis = random.sample([x for x in INTERESTS if x not in ints], random.randint(1, 2))
    vals = random.sample(VALUES, random.randint(2, 4))
    job = random.choice(JOBS)
    if random.random() < 0.45 and any(k in job for k in ("Engineer","Product","Data","Designer","Scientist","Architect","Analyst","Manager")):
        job = f"{job} at {random.choice(COMPANIES)}"
    city = random.choice(CITIES)
    goal = random.choice(GOALS)
    likes_raw = [random.choice(RAW[t]) for t in ints[:3]]
    first = name.split()[0]
    summary = f"{first} is a {age}-year-old {job.split(' at ')[0].lower()} in {city} who loves {likes_raw[0]} and {likes_raw[1]}, and is looking for {'a ' + goal + ' relationship' if goal not in ('not sure',) else 'the right connection'}."
    out.append({
        "id": f"seed-{i+15:03d}", "source": "seed", "name": name, "age": age, "gender": gender, "looking_for": looking,
        "hometown": random.choice(HOMETOWNS), "current_city": city, "dream_city": random.choice(DREAM), "height_cm": height,
        "occupation": job, "interests": ints, "likes_raw": likes_raw, "dislikes": dis,
        "dislikes_raw": [random.choice(RAW[d]) for d in dis], "values": vals, "relationship_goal": goal,
        "personality": random.choice(PERS), "summary": summary,
        "created_at": f"2026-{random.randint(6,10):02d}-{random.randint(1,28):02d}T{random.randint(0,23):02d}:{random.randint(0,59):02d}:00Z",
    })
json.dump(out, open("data/generated-members.json", "w"), indent=1)
print(len(out), "generated;", sum(p["gender"]=="female" for p in out), "F", sum(p["gender"]=="male" for p in out), "M")
