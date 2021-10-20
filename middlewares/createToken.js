const jwt = require("jsonwebtoken");
const { secret_key, tokenMaxAge } = require("../config/key");

module.exports.createToken = async (user, tokenType) => {
    let tokenAge = tokenMaxAge;
    const token = await jwt.sign({ userId: user._id, tokenType: tokenType }, secret_key, {
        expiresIn: tokenAge,
    });
    return token;
};
