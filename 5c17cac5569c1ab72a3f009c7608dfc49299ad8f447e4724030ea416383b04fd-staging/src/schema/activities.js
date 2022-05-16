/* eslint-disable linebreak-style */
import { gql } from 'apollo-server-express';

export default gql`

  extend type Mutation {
    addWatchTime(
        videoId: Int!
        watchtime: Float
    ): Message
    Videoanalytics(
        videoId: Int
        watchtime: Float!
        InfluencerId: Int!
        viewCount:Int
        impression:Int
        clicks:Int
        viewId:Int!
    ): Message
    Adsanalytics(
        watchtime: Float!
        adsId: Int!
        InfluencerId: Int!
        campaignId: Int!
        viewId:Int!
        viewCount:Int
        impression:Int
        clicks:Int
    ): Message
    addShareCount(
        videoId: Int!
    ): Message
    addviewCount(
        videoId: Int!
    ): Message
  }
`;
