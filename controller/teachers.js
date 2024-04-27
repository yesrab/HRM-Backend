const test = (req, res) => {
  res.json({ lol: "lol" });
};

const addTeacher = (request, response) => {
  response.json({ lol: "lmao" });
};

module.exports = { test, addTeacher };
