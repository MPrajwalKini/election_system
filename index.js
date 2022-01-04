const express=require("express")
const app=express()
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser")

app.use(express.json())

app.use(express.urlencoded({extended:true}))

var url=bodyParser.urlencoded({
    extended:false
  });

  app.set('view engine','ejs')

const db=new sqlite3.Database('./election.db',err=>{
    if(err){
      console.log(err)
    }
    console.log("db connected")
})
//db.run(`drop table voter`)

//db.run(`PRAGMA foreign_keys=ON;`)

const create_voter=`create table if not exists voter(
  voter_id int NOT NULL,
  voter_name varchar(50),
  address varchar(500),
  email varchar(50),
  phone numeric(15),
  age int,
  primary key(voter_id)
  );`

const create_party=`create table if not exists party(
    party_id varchar(20),
    party_name varchar(50),
    primary key(party_id)
);`

const create_center=`create table if not exists voting_center(
    voting_center_id int,
    voting_ceter_name varchar(50),
    location varchar(50),
    primary key(voting_center_id)
);`

const create_candidate=`create table if not exists candidate(
    candidate_id int,
    candidate_name varchar(50),
    party_id varchar(20),
    can_address varchar(50),
    email varchar(50),
    phone numeric(15),
    primary key(candidate_id),
    foreign key(party_id) references party(party_id) on delete cascade
);`

const create_vote=`create table if not exists vote(
    voter_id int,
    candidate_id int,
    voting_center_id int,
    primary key(voter_id),
    foreign key(voter_id)references voter(voter_id) on delete cascade,
    foreign key(candidate_id)references candidate(cadidate_id) on delete cascade,
    foreign key(voting_center_id)references candidate(voting_center_id) on delete cascade
);`

//db.run for creation and insertion
//table creation
app.get('/create',async(req,res)=>{
    await db.run(create_voter,(err)=>{
        (err)?console.log(err):console.log("Voter table created")    
    
    })
    await db.run(create_party,(err)=>{
        (err)?console.log(err):console.log("Party table created")    
    
    })
    await db.run(create_center,(err)=>{
        (err)?console.log(err):console.log("center table created")    
    
    })
    await db.run(create_candidate,(err)=>{
        (err)?console.log(err):console.log("Candidate table created")    
    
    })
    
    await db.run(create_vote,(err)=>{
        (err)?console.log(err):console.log("Vote table created")    
    
    })
    res.json("tables created successfully")
})

//tests
//db.run(`insert into voter(voter_id,voter_name,address,email,phone,age) values(${id+=1},'ashwin','mangalore','@mail.com','9898765',20);`)
//db.run(`delete from voter`)
//db.run(`delete from vote`)
//db.run(`delete from voting_center where voting_center_id=30;`)
/*db.all(`select * from voter`,(err,rows)=>{
    console.log(rows)
})*/
var can_id=69

//db.run(`insert into voting_center(voting_center_id,voting_ceter_name,location) values (10,'Ladyhill','Ladyhill'),(20,'Bundar','Bundar'),(30,'CHS','CHS'),(40,'Car st','Car st')`)

app.get('/test/:id',async(req,res)=>{
 let id=await req.params.id;
 let sql
 switch(id){
     case "candidate":
         sql="select * from candidate"
         break
     case "voter":
         sql="select * from voter"
         break
     case "vote":
         sql="select * from vote"
         break
     case "center":
         sql="select * from voting_center"
         break
     case "party":
         sql="select * from party"
         break
     default:
         res.json("error")
         return
 }
 db.all(sql,async(err,rows)=>{
   await res.json(rows)
 })
})

app.get('/',(req,res)=>{
    db.all(`select location from voting_center`,(err,rows)=>{
        res.render('index',{loc:rows})
    })
})
var id
var center
app.post('/',async(req,res,next)=>{
    //console.log(req.body)
   await db.run(`insert into voter values(${ await req.body.id},'${await req.body.name}','${await req.body.add}','${await req.body.email}',${await req.body.phno},${await req.body.age})`,(err)=>{
        if(err){
            res.send(err)
        }
    }),
  await  db.all(`select * from candidate`,async(err,rows)=>{

     await   res.render("vote",{name_id:rows})
    })
     id=await req.body.id
     center=await req.body.center.trim()
//   await voted(id,center)
})

/*async function voted(id,center)
{ */
    app.post('/vote',async(req,res)=>{
  await db.run(`insert into vote values(${await id},${await req.body.value},(select voting_center_id from voting_center where location ='${await center}'));`,(err)=>{
       if(err)console.log(err)
       else  res.render("voted")
       delete id
   })
})
//}

/* New index */

/*app.get('/',(req,res)=>{
    db.all(`select location from voting_center`,(err,rows)=>{
        res.render('index',{loc:rows})
    })
})

app.post('/vote',(req,res)=>{
    db.run(`insert into voter values(${req.body.id},'${req.body.name}','${req.body.add}','${req.body.email}',${req.body.phno},${req.body.age})`,(err)=>{
        if(err)console.log(err)
        else {
            db.all(`select * from candidate`,(err,rows)=>{
                res.render("vote",{name_id:rows})
            })
            }
    })
})
app.get('/vote',(req,res)=>{
    db.all(`select * from candidate`,(err,rows)=>{
        res.render("vote",{name_id:rows})
    })
})
app.post('/voted',(req,res)=>{
    db.run(`insert into vote values(${},(select candidate_id from candidate where candidate_id=${req.body.value}),(select voting_center_id from voting_center where location ='${await center}'`)
})*/
//adi's code
//learn from it
/* Insertions */

app.get('/inde',(req,res)=>{
    res.render('insert')
})

app.post('/inde',(req,res)=>{
    if(req.body.dvote){
    db.run(`delete from vote`,(err)=>{
        if(err)
        console.log(err)
        else
        res.render('insert')
    })
    }
    else if(req.body.dvoter){
        db.run(`delete from voter`,(err)=>{
            if(err)
            console.log(err)
            else
            res.render('insert')
        })
    }
})

app.get('/insertcan',async(req ,res  )=>{
    let result = [];
    try{
       await  db.all(`SELECT party_id FROM party`, async (err  ,rows )=>{
            if(err){
                log(err);
                res.json({error: err});
                return;
            }
            else{
                console.log(rows)
                for(let i = 0 ; i < rows.length ; i++){
                    result.push(rows[i].party_id);
            }
          await  res.render("insertcan",{par_id: result});
            }
        })

    }
    catch(error){
        log(error);
        res.json({ error: error });
    }
    
})

app.post('/insertcan',async(req,res)=>{
    console.log(req.body)
    if(req.body.delete){
        db.run(`delete from candidate;`)
    }
    else{
    let info=req.body
   await db.run(`insert into candidate values(${info.id},'${info.name}','${info.party_id}','${info.address}','${info.mail}',${info.phno})`)
    }
    let result = [];
    try{
       await  db.all(`SELECT party_id FROM party`, async (err  ,rows )=>{
            if(err){
                log(err);
                res.json({error: err});
                return;
            }
            else{
                console.log(rows)
                for(let i = 0 ; i < rows.length ; i++){
                    result.push(rows[i].party_id);
            }
          await  res.render("insertcan",{par_id: result});
            }
        })

    }
    catch(error){
        log(error);
        res.json({ error: error });
    }
    

})

app.get('/insertparty',(req,res)=>{
    res.render("insertparty")
})
app.post('/insertparty',async(req,res)=>{
   await db.run(`insert into party values ('${req.body.par_id}','${req.body.par_name}')`)
    res.render('insertparty')
})


app.get('/insertcenter',(req,res)=>{
    res.render('insertcenter')
})
app.post('/insertcenter',async(req,res)=>{
   await db.run(`insert into voting_center values (${req.body.center_id},'${req.body.center_name}','${req.body.location}')`)
    res.render('insertcenter')
})

/* Deletions */
app.get('/deletecan',async(req,res)=>{
   await db.all(`select candidate_id from candidate`,(err,rows)=>{
        res.render('deletecan',{id:rows})  
    })
})

app.post('/deletecan',(req,res)=>{
    db.run(`DELETE FROM candidate WHERE candidate_id=${req.body.can_id} and candidate_name='${req.body.name}' `,(err)=>{
        if (err)
        console.log(err)
        else{
             db.all(`select candidate_id from candidate`,(err,rows)=>{
                res.render('deletecan',{id:rows})  
            })
        }
    })
})

app.get('/deletepar',(req,res)=>{
    db.all(`select party_id from party`,(err,rows)=>{
        res.render('deletepar',{id:rows})
    })
})

app.post('/deletepar',(req,res)=>{
    db.run(`DELETE FROM party WHERE party_id='${req.body.can_id}' and party_name='${req.body.name}' `,(err)=>{
        if (err)
        console.log(err)
        else{
             db.all(`select party_id from party`,(err,rows)=>{
                res.render('deletepar',{id:rows})  
            })
        }
    })
})

app.get('/deletecenter',(req,res)=>{
    db.all(`select voting_center_id from voting_center`,(err,rows)=>{
        res.render('deletecenter',{id:rows})
    })
})

app.post('/deletecenter',(req,res)=>{
    db.run(`DELETE FROM voting_center WHERE voting_center_id='${req.body.can_id}' and voting_ceter_name='${req.body.name}' `,(err)=>{
        if (err)
        console.log(err)
        else{
             db.all(`select voting_center_id from voting_center`,(err,rows)=>{
                res.render('deletecenter',{id:rows})  
            })
        }
    })
})

app.get('/deletevoter',(req,res)=>{
    db.all(`select voter_id from voter`,(err,rows)=>{
        res.render('deletevoter',{id:rows})
    })
})

app.post('/deletevoter',(req,res)=>{
    db.run(`DELETE FROM voter WHERE voter_id='${req.body.can_id}' and voter_name='${req.body.name}' `,(err)=>{
        if (err)
        console.log(err)
        else{
             db.all(`select voter_id from voter_name`,(err,rows)=>{
                res.render('deletevoter',{id:rows})  
            })
        }
    })
})

/* Total vote count */
app.get('/totalvotes',(req,res)=>{
    db.all(`select count(candidate_id) as candidate,candidate_id from vote group by (candidate_id)`,(err,rows)=>{
        if(err){
            console.log(err)
        }
        console.log(rows)
    })
})



app.listen('3000')