import {Agent , Task , Team} from "kaibanjs"
import {TavilySearchResults} from "@langchain/community"
import { NextResponse } from "next/server"



//1 define the search tool that we can use to search the agent 
const searchTool = new TavilySearchResults ({
    maxResults : 5,
    apiKey : process.env.TAVILY_API_KEY
})


//2 create researchAgent (the first agent of our team)
const researchAgent = new  Agent({
    name : "Adam",
    role : "New Researcher",
    goal : "Find and summarize the latest news on a given topic",
    background : "Experienced in data analysis and information gathering",
    tools : [searchTool],
    llmConfig : {
        provider : "google",
        model : "gemini-1.5-flash-latest",
        apiKey : process.env.GOOGLE_API_KEY
    }
}) 


const writerAgent = new  Agent({
    name : "Adam",
    role : "New Researcher",
    goal : "Find and summarize the latest news on a given topic",
    background : "Experienced in data analysis and information gathering",
    tools : [searchTool],
    llmConfig : {
        provider : "google",
        model : "gemini-1.5-flash-latest",
        apiKey : process.env.GOOGLE_API_KEY
    }
}) 