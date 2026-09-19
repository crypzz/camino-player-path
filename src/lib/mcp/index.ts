import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listPlayersTool from "./tools/list-players";
import getPlayerTool from "./tools/get-player";
import createEvaluationTool from "./tools/create-evaluation";
import addPlayerFeedbackTool from "./tools/add-player-feedback";
import listTrainingSessionsTool from "./tools/list-training-sessions";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "camino-player-journey",
  title: "Camino: Player Journey",
  version: "0.1.0",
  instructions:
    "Tools for Camino, a soccer player development platform. Use `list_players` and `get_player` to read squad and player development data, `create_evaluation` to record technical/tactical/physical/mental ratings, `add_player_feedback` to write coach feedback, and `list_training_sessions` for the training schedule. All tools act as the signed-in Camino user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listPlayersTool,
    getPlayerTool,
    createEvaluationTool,
    addPlayerFeedbackTool,
    listTrainingSessionsTool,
  ],
});
