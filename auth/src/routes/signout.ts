import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
    console.log('signout');
    req.session = null;
    res.status(200).send({});
});

export { router as signoutRouter };