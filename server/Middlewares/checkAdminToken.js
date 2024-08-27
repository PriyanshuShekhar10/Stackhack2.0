const jwt = require("jsonwebtoken");

function checkAdminToken(req, res, next) {
  console.log("before token handler works");
  const adminAuthToken = req.cookies.adminAuthToken;
  // console.log('adminAuthToken: ', adminAuthToken);
  if (!adminAuthToken) {
    return res.status(401).json({
      message: "Admin authentication failed: No adminAuthToken provided",
      ok: false,
    });
  }
  console.log("auth token exists");
  jwt.verify(
    adminAuthToken,
    process.env.JWT_ADMIN_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        console.error(
          "Admin authentication failed: Invalid adminAuthToken",
          err
        );
        return res.status(401).json({
          message: "Admin authentication failed: Invalid adminAuthToken",
          ok: false,
        });
      } else {
        console.log("Admin authentication successful");
        // Admin auth token is valid, continue with the request
        req.adminId = decoded.adminId;
        next();
      }
    }
  );
  console.log("auth token verified");
}

module.exports = checkAdminToken;
