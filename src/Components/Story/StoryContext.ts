import React from "react";
import StoryData from "../../DataAccess/DTOs/StoryData";

interface StoryContext {
  story: StoryData;
  pageIds: string[];
}

const storyContext = React.createContext<StoryContext>({
  story: {
    storyId: "",
    beginningPageId: "",
    title: "",
    description: ""
  },
  pageIds: []
});

export default storyContext;
