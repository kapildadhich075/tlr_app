import {
  horizontalVideoImage,
  verticalVideoImage,
  squareVideoImage,
  channelAssetsImage,
  thumbnailImage,
  otherImage,
} from "../constantImages";

export const ORDER_TYPES = [
  {
    id: "orderType-horizontal-video",
    value: "horizontal-video",
    label: "Horizontal Video",
    para: "Any Horizontal 16:9 video. Usually for Youtube, Facebook, Vimeo, etc.",
    image: { src: horizontalVideoImage, alt: "Horizontal Video" },
  },
  {
    id: "orderType-vertical-video",
    value: "vertical-video",
    label: "Vertical Video",
    para: "Any Vertical 9:16 video less than 60 seconds. Usually for Instagram Reels, TikTok, Snapchat, or Youtube Shorts.",
    image: { src: verticalVideoImage, alt: "Vertical Video" },
  },
  {
    id: "orderType-square-video",
    value: "square-video",
    label: "Square Video",
    para: "Any Square 1:1 video. Usually for Instagram, Facebook, Twitter, etc.",
    image: { src: squareVideoImage, alt: "Square Video" },
  },
  {
    id: "orderType-channel-assets",
    value: "channel-assets",
    label: "Channel Assets",
    para: "Custom Brand Intro, Endscreens, and Call to Actions that can be used in all of your Youtube videos.",
    image: { src: channelAssetsImage, alt: "Channel Assets" },
  },
  {
    id: "orderType-thumbnail",
    value: "thumbnail",
    label: "Thumbnail",
    para: "Custom Thumbnail for your Youtube videos. No Video Editing.",
    image: { src: thumbnailImage, alt: "Thumbnail" },
  },
  {
    id: "orderType-other",
    value: "other",
    label: "Other",
    para: "Any other type of video or graphic design work.",
    image: { src: otherImage, alt: "Other" },
  },
];
