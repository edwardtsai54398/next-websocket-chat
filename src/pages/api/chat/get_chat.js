import {withValidation} from "../withValidation";
import Conversation from "@/lib/db/Conversation";
import Message from "@/lib/db/Message.js";
import User from '@/lib/db/User.js'

const fakeData = {
  status: 1,
  result: [
    {
      "conversationId": "235ee298-6dd9-4bf2-b8a1-7a76de1b3c2e",
      "conversationName": "New Speaker",
      "latestContent": "Sample message 50",
      "timestamp": 1727837340,
      "unreadTotal": 10,
      "latestMessages": [
        {
          "messageId": "9ebedbe8-928a-42ba-b832-87a12215f44c",
          "content": "Sample message 1",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727834400,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "1a6b9a19-53a7-446a-9f25-e74593028c89",
          "content": "Sample message 2",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727834460,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "dab0950f-524b-4796-8575-39804bb194ad",
          "content": "Sample message 3",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727834520,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "e1352432-0dce-4c93-9d18-16aae56f51c1",
          "content": "Sample message 4",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727834580,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "4cfb7da0-6832-4d1f-9475-87855377dd56",
          "content": "Sample message 5",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727834640,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "ad85b24f-3973-4041-83e7-35ef55b89293",
          "content": "Sample message 6",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727834700,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "ea46c8cb-a9af-49e1-aa00-fdcd5e2b2c23",
          "content": "Sample message 7",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727834760,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "4bf27905-dc65-488a-a754-77b8f1fdf66e",
          "content": "Sample message 8",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727834820,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "7c54a098-cefe-41e9-bf25-4ee152ebb285",
          "content": "Sample message 9",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727834880,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "3a90d3aa-60f0-414e-a897-0d232c9c4df3",
          "content": "Sample message 10",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727834940,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "343813ab-82f0-40aa-b017-53f27bb84a92",
          "content": "Sample message 11",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835000,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "8be16c09-0776-4159-b6bb-de473eeb234e",
          "content": "Sample message 12",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835060,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "76a5f2af-8f01-4d19-a80b-dcc254337c3c",
          "content": "Sample message 13",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835120,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "4ee60469-e89f-43d0-9c6a-7a1a5f9ae087",
          "content": "Sample message 14",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835180,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "a9b612e1-80a2-483e-a06a-aa25e5d66867",
          "content": "Sample message 15",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835240,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "10c0a1b8-ee2d-4cfa-a3e6-2406db30e4d3",
          "content": "Sample message 16",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835300,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "0c91be45-5c84-489c-a902-500d9e6132f8",
          "content": "Sample message 17",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835360,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "b4778747-a64c-45c7-8947-1355507285ca",
          "content": "Sample message 18",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835420,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "0bdb2fd1-bcfc-48ac-a140-e6a2b368f8f0",
          "content": "Sample message 19",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835480,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "e2b41438-5be4-4f2c-9518-2d9084be9430",
          "content": "Sample message 20",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835540,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "3e213a1f-8f25-4332-b53d-e97e8f28f192",
          "content": "Sample message 21",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835600,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "84438699-0655-4374-bd90-05287e3eb7f7",
          "content": "Sample message 22",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835660,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "685cdac8-66b5-4c56-8e12-8d258dc692b3",
          "content": "Sample message 23",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835720,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "c6ec2e96-39c9-489e-a217-2c1c8aa7b5e2",
          "content": "Sample message 24",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835780,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "2e682e22-ae9c-4da2-bd90-bd9bc1ac6bb4",
          "content": "Sample message 25",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835840,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "1fba6501-5d0f-4113-b93b-d3f6d134ca64",
          "content": "Sample message 26",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727835900,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "9ea3d180-275b-45dc-8714-74e6258710ac",
          "content": "Sample message 27",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727835960,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "b67d04ee-aeb4-4697-89f0-9d6ffb5543bc",
          "content": "Sample message 28",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836020,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "7164346f-8774-45d9-8885-4dfa64acd224",
          "content": "Sample message 29",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727836080,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "788d6f4b-ac37-4c84-8cb8-a70c1cbb8441",
          "content": "Sample message 30",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836140,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "28cc3da0-f92d-47da-9ee2-cd2596673d93",
          "content": "Sample message 31",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727836200,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "7175d488-1a0c-40fc-b63d-9e0943e72f56",
          "content": "Sample message 32",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836260,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "951d4bd7-bf97-4f09-8f40-912eb22ac8b6",
          "content": "Sample message 33",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727836320,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "5fa6f828-dcbe-4f9d-b9de-560a8a2f55bb",
          "content": "Sample message 34",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836380,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "59d37b41-6c25-43a3-be62-d05ed98e0fa6",
          "content": "Sample message 35",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727836440,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "c9ff2960-cc45-4088-9f14-372887b91caa",
          "content": "Sample message 36",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836500,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "f1dc787e-9b51-49a9-b272-dc48be23ea19",
          "content": "Sample message 37",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727836560,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "96ce6baf-ed14-4209-be27-be9049225157",
          "content": "Sample message 38",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836620,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "41efd4bb-7961-4cb5-af76-c01367707ed2",
          "content": "Sample message 39",
          "speakerName": "User Me",
          "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
          "timestamp": 1727836680,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "52bb3f98-85df-40a8-af04-1eb795d393e3",
          "content": "Sample message 40",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836740,
          "readUser": [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "c3ef5842-a2a7-41f5-acea-5377d7b5e03c",
          "content": "Sample message 41",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836800,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "54011324-2675-455f-b8aa-6df73b035c53",
          "content": "Sample message 42",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836860,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "0be9d431-73f5-4ff7-8d12-25e4213c5d12",
          "content": "Sample message 43",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836920,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "5ff14ba9-fbf3-4b25-889c-c918c2e505c6",
          "content": "Sample message 44",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727836980,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "066831fc-0833-4856-96f7-9712880a4582",
          "content": "Sample message 45",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727837040,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "0803feb3-43dd-4e2a-bfb9-acc1f9d944e4",
          "content": "Sample message 46",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727837100,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "f7c5b8a9-411c-4176-8e26-2627cdfb6386",
          "content": "Sample message 47",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727837160,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "7817769b-0822-4d9b-b17b-c146a1f89d2b",
          "content": "Sample message 48",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727837220,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "5eb57486-6199-45b4-a1c3-3fa65c1b6fbc",
          "content": "Sample message 49",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727837280,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        },
        {
          "messageId": "7be07fa0-7b3b-49bf-89d4-bbbd710607f2",
          "content": "Sample message 50",
          "speakerName": "New Speaker",
          "speakerId": "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2",
          "timestamp": 1727837340,
          "readUser": [
            "800d0ddd-a5eb-48dd-bba4-a09f1c16a2c2"
          ]
        }
      ]
    },
  ]
}

const handler = async (req, res) => {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json(fakeData);
  } else {
    const {conversationId} = req.body;
    const userId = req.headers["user-id"];
    if(conversationId && typeof conversationId === "string") {
      try{
        const conversation = await Conversation.findOne({conversationId})
        if(conversation) {
          let allMessages = await Message.find({inConversationIds: conversationId}).sort({timestamp: -1}).limit(50).lean();
          let members = await User.find({userId: {$in: [conversation.members]}}).lean()
          let conversationName = conversation.conversationName;
          if(!conversationName || conversationName === ""){
            const anotherUser =  members.find(u => u.userId !== userId)
            conversationName = anotherUser.userName
          }
          allMessages.reverse()
           const latestMessages = await Promise.all(allMessages.map(async (message) => {
             let feedbackContent = null
             if(message.feedback){
               let feedbackMsg = allMessages.find(m => m.messageId === message.feedback)
               if(!feedbackMsg) {
                 feedbackMsg = await Message.fineOne({messageId: message.feedback})
               }
               feedbackContent = {
                 messageId: feedbackMsg.messageId,
                 content: feedbackMsg.content,
                 speakerId: feedbackMsg.speaker,
                 speakerName: members.find(u => u.userId === feedbackMsg.speaker).userName
               }
             }
             return {
               messageId: message.messageId,
               content: message.content,
               speakerId: message.speaker,
               speakerName: members.find(u => u.userId === message.speaker).userName,
               timestamp: message.timestamp,
               readUser: message.readUser,
               feedback: feedbackContent,
             }
           }))
          const newestMessage = latestMessages[latestMessages.length - 1]
          const unreadTotal = latestMessages.filter(m => !m.readUser.some(id => userId === id)).length
          res.status(200).json({
            status: 1,
            result: {
              conversationId,
              conversationName,
              latestContent: newestMessage.content,
              timestamp: newestMessage.timestamp,
              unreadTotal,
              latestMessages
            }
          });
        }else{
          res.status(404).json({
            status: 0,
            errorMessage: "chat not exists",
          });
        }
      } catch(error){
        console.error("ERROR get_chat", error);
      }
    }else {
      res.status(403).json({
        status: 0,
        errorMessage: "Wrong data format",
      });
    }
  }
}

export default withValidation(handler, "POST");