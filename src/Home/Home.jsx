import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import hero from "../assets/hero1.svg";

// Styled components
const AnimatedBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 87vh;
  background-color: #C3C3E5;
  color: #000000;
`;

const Home = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  return (
    <AnimatedBox
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={titleVariants}>
        <Typography variant="h1" align="center" sx={{ fontSize: "4rem", fontWeight: "bold", mb: "1rem" }}>
          Smart Traffic Management
        </Typography>
      </motion.div>
      <Typography variant="h2"  align="center" sx={{ fontSize: "2.2rem", mb: "2rem" }}>
        Welcome to our traffic management system
      </Typography>
      <motion.img
        src={hero}
        alt=""
        style={{ width: "400px", marginBottom: "2rem" }}
      />
    </AnimatedBox>
  );
};

export default Home;
