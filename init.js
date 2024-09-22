const mongoose = require("mongoose");
const chat = require("./models/chat.js");

main()
    .then(() => {
        console.log("connnection successful");
    }).catch((err) => console.log(err));


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");

};


let allChats = [
    {
        from: "neeraj",
        to: "priyansu",
        msg: "send me your notes",
        created_at: new Date(),
    },
    {
        from: "Harsh",
        to: "himani",
        msg: "hello what's up ",
        created_at: new Date(),
    },
    {
        from: "anuj",
        to: "kumar",
        msg: "all the best of exams",
        created_at: new Date(),
    },
    {
        from: "Ansu",
        to: "priya",
        msg: "teach me some books",
        created_at: new Date(),
    },
]

chat.insertMany(allChats);
