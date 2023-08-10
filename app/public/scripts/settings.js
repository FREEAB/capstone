app.post("/api/schedule", authenticateToken, async (req, res) => {
    const { user_id, date, location_id } = req.body;
    console.log(user_id, date, location_id);
    const results = await scheduleDatabase.createSchedule(user_id, date, location_id);
    res.status(200).json({ message: "Settings were saved!" });
});