const Customer = require("../models/Customer");

const createCustomer = (data) => {
    const customerExists = await Customer.findOne({
        phoneNo: data.phoneNo
    });

    if (customerExists) {
        const error = new Error("Customer already exists");
        error.statusCode = 400;
        throw error;
    }

    return await Customer.create(data);
};

const getCustomers = (id, data) => {
    return await Customer.find().sort({ createdAt: -1 });
};

const searchCustomers = async (query) => {
    return await Customer.find({
        name: { $regex: query, $options: "i" },
    }).sort({ createdAt: -1 });
};

const getCustomer = (id) => {
    const customer = await Customer.findById(id);

    if (!customer) {
        const error = new Error("Customer not found");
        error.statusCode = 404;
        throw error;
    }

    return customer;
};

const updateCustomer = (id, data) => {
    const customer = await Customer.findByIdAndUpdate(id, data, {
        new: true,
        runValidator: true
    });

    if (!customer) {
        const error = new Error("Customer not found");
        error.statusCode = 404;
        throw error
    }

    return customer;
};

const deleteCustomer = (id) => {
    const customer = await Customer.findById(id);

    if (!customer) {
        const error = new Error("Customer not found");
        error.statusCode = 404;
        throw error;
    }

    await customer.deleteOne();
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomer,
    searchCustomers,
    updateCustomer,
    deleteCustomer,
};
