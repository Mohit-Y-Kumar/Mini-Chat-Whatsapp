const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");



main()
    .then(() => {
        console.log("connnection successful");
    }).catch((err) => console.log(err));


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");

};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); //for parse data
app.use(methodOverride("_method"));


// INDeX ROUTE
app.get("/chats", async (req, res) => {
    try {


        let chats = await chat.find();
        // console.log(chats);
        res.render("index.ejs", { chats });
    } catch (err) {
        next(err);
    }
});

//NEw ROUTE

app.get("/chats/new", (req, res) => {
    // throw new ExpressError(404, "Page not found");
    res.render("new.ejs");
});

//CREATE ROUTE

app.post("/chats", async (req, res, next) => {
    try {


        let { from, to, msg } = req.body;
        let newchat = new chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date()
        });
        await newchat.save().then((res) => {
            console.log("chat was saved");
        });
        res.redirect("/chats");
    } catch (err) {
        next(err);
    }

});

function asyncwrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
};


//New -- show route

app.get("/chats/:id", asyncwrap(async (req, res, next) => {



    let { id } = req.params;
    let chatss = await chat.findById(id);
    if (!chatss) {
        next(new ExpressError(500, "Chat not found"));

    }
    res.render("edit.ejs", { chatss });

}));

//Edit ROUTe
app.get("/chats/:id/edit", asyncwrap(async (req, res) => {



    let { id } = req.params;
    let chatss = await chat.findById(id);
    res.render("edit.ejs", { chatss });

}));

//Update route

app.put("/chats/:id", asyncwrap(async (req, res) => {



    let { id } = req.params;
    let { msg: newMsg } = req.body;
    console.log(newMsg);
    let updatedchat = await chat.findByIdAndUpdate(
        id,
        { msg: newMsg },
        { runValidators: true, new: true }
    );
    console.log(updatedchat);

    res.redirect("/chats");

}));

//Destroy Route

app.delete("/chats/:id", asyncwrap(async (req, res) => {

    let { id } = req.params;
    let deltetedChat = await chat.findByIdAndDelete(id);
    console.log(deltetedChat);
    res.redirect("/chats");

}));



app.get("/", (req, res) => {
    res.send("root is working");
});

const handlevalidationErr = (err) => {
    console.log("This was a validation error. Please follow rules");
    console.dir(err.message);
    return err;
}

app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === "ValidationError") {
        err = handlevalidationErr(err);

    }
    next(err);
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "some error occured" } = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080: ");
});