const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB Connected");
    // we're connected!
});
const port = 3000;

const studentSchema = new mongoose.Schema({
    name: String,
    class: Number,
    age: Number
});

var Student = mongoose.model("Student", studentSchema);

// var stu = new Student({name: "Hamza"});
// stu.save();


app.get("/", (req, res) => {
    res.send({ status: true, message: "welcome" });
});

app.post("/student", (req, res) => {
    var data = req.body; // {name: 'abc'}
    var stu = new Student(data);
    // Student.insertMany([{name: 'abc'}, {name: 'xyz'}])
    // stu.save((err, res) => { })
    stu.save()
        .then((resolve) => {
            console.log("Resolve: ", resolve);
            res.send(resolve);
        })
        .catch((err) => {
            console.log("Error: ", err);
            res.status(500);
            res.send("Something went wrong");
        })
        ;
});

// app.get("/student", (req, res) => {
//     Student.find((error, response) => {
//         if(error){
//             res.status(500);
//             res.send(error);
//             return;
//         }
//         res.send(response);
//     })
// });

app.get("/student", (req, res) => {
    var query = {
        // $or: [{name: "Ali"}, {name: "Taha"}]
        // name: {$or: [{$gt: 8}, {$lt: 10}]},
        // age: {$gt: 10},
        // class: {$gt: 8, $lt: 10}
        $or: [{ class: { $gt: 8 } }, { class: { $lt: 10 } }]
    }
    // Student.findOne(query)
    // Student.findById(id)
    Student.find(query, (error, response) => {
        if (error) {
            res.status(500);
            res.send(error);
            return;
        }
        res.send(response);
    })
});

app.delete('/student/:id', (req, res) => {
    var id = req.params.id;
    // Student.findByIdAndRemove(id)
    Student.remove({ _id: id })
        .then(resolve => {
            console.log("Delete Succesfully: ", resolve);
            res.send("Student Deleted");
        });
})

app.put('/student/:id', (req, res) => {
    var id = req.params.id;
    var data = req.body;
    // Student.findByIdAndUpdate(id)
    // Student.findOneAndUpdate(id)
    Student.update({ _id: id }, data, (error, response) => { 
        if(error){
            console.log("Err: ", error);
            res.send(error);
            return;
        }
        res.send(response);
    })
    // Student.remove({ _id: id })
    //     .then(resolve => {
    //         console.log("Delete Succesfully: ", resolve);
    //         res.send("Student Deleted");
    //     });
})

app.use('**', (req, res) => { res.send('404') });

app.listen(port, () => { console.log('Running') });


// var students = [
//     {name: 'Taha', id:1},
//     {name: 'Hamza', id:2}
// ];
// var courses = [
//     {name: 'English', id:1},
//     {name: 'Maths', id:2}
// ];
// var regester = [
//     {studentId: 1, courseId: 2},
//     {studentId: 1, courseId: 1},
// ]
