import React, { useState, useEffect, useContext } from "react";
import Image from 'next/image';
import Countdown from "react-countdown";

// INTERNAL Import
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/card/card";
import image from "../assets/candidate-1.jpg";

const index = () => {
  const {votingTitle} = useContext(VotingContext);
  return <div>
    {votingTitle}
  </div>;
};

export default index;

