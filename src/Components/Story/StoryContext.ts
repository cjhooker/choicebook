import React from "react";
import StoryData from "../../DataAccess/DTOs/StoryData";

interface StoryContext {
  story: StoryData;
}

const storyContext = React.createContext<StoryContext>({
  story: {
    storyId: "",
    beginningPageId: "",
    title: "",
    description: ""
  }
});

export default storyContext;
