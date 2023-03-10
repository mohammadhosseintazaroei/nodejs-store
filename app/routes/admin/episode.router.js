const { EpisodeController } = require("../../http/controllers/admin/episode.controller");
const { UploadVideo } = require("../../utils/multer");

const router = require("express").Router();

router.post("/add", UploadVideo.single("video"), EpisodeController.AddNewEpisode)
router.delete("/remove/:episodeID", EpisodeController.RemoveEpisode)
router.patch("/update/:episodeID", EpisodeController.EditEpisode)

module.exports = {
    AdminEpisodesRouter : router
}
