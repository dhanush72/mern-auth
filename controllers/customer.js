const Customer = require("../models/customer");

exports.customer = async (req, res) => {
  try {
    const { name } = req.body;

    const newCustomer = await new Customer({
      name,
    }).save();

    res.json(newCustomer);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

exports.customers = async (req, res) => {
  try {
    const customers = await Customer.find({}).exec();
    res.json(customers);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
