import { Router } from "express";
import passport from "passport";
 
const router = Router();
 
// Start Google OAuth
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));
 
// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "/auth/protected",
  })
);
 
// Logout
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout error" });
    res.redirect("/");
  });
});
 
// Failure route
router.get("/failure", (_, res) => {
  res.status(401).send("Failed to authenticate.");
});
 
// Protected route example
router.get("/protected", (req, res) => {
  if (req.user) {
    res.json({ message: "You are logged in", user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});
 
export default router;