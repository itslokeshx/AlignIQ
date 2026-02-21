"""
ALIGNIQ — Resource Map with YouTube API Integration
Curated links (Coursera, Udemy, Skillshare, edX, Khan Academy)
+ dynamic YouTube videos via Google YouTube Data API v3.

Set YOUTUBE_API_KEY env var for live YouTube video suggestions.
Without it, curated-only mode still works with 200+ skill keywords.
"""

import os
import re
import json
import logging
import urllib.request
import urllib.parse
from functools import lru_cache

logger = logging.getLogger(__name__)

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
YT_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


# ══════════════════════════════════════════════════════════════════════════
# CURATED RESOURCES — 200+ skill keywords with real, working links
# All keys are LOWERCASE for consistent matching
# ══════════════════════════════════════════════════════════════════════════

RESOURCE_MAP = {
    # ── PROGRAMMING & TECH ────────────────────────────────────────────────
    "python": [
        {"title": "Python for Everybody Specialization", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/python"},
        {"title": "100 Days of Code — Python Bootcamp", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/100-days-of-code/"},
    ],
    "javascript": [
        {"title": "JavaScript Algorithms & DS", "platform": "freeCodeCamp", "type": "course", "url": "https://freecodecamp.org/learn/javascript-algorithms-and-data-structures"},
        {"title": "The Complete JavaScript Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/the-complete-javascript-course/"},
    ],
    "java": [
        {"title": "Java Programming — MOOC.fi", "platform": "Coursera", "type": "course", "url": "https://java-programming.mooc.fi"},
        {"title": "Java Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/java-the-complete-java-developer-course/"},
    ],
    "c++": [
        {"title": "C++ Beginners to Advanced", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/beginning-c-plus-plus-programming/"},
        {"title": "C++ Full Course", "platform": "freeCodeCamp", "type": "course", "url": "https://freecodecamp.org/news/learn-c-with-free-31-hour-course/"},
    ],
    "react": [
        {"title": "React — The Complete Guide", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/react-the-complete-guide-incl-redux/"},
        {"title": "React Official Tutorial", "platform": "Practice", "type": "practice", "url": "https://react.dev/learn"},
    ],
    "node": [
        {"title": "Node.js Developer Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/the-complete-nodejs-developer-course-2/"},
        {"title": "Node.js Official Docs", "platform": "Practice", "type": "practice", "url": "https://nodejs.org/en/learn"},
    ],
    "sql": [
        {"title": "SQL for Data Science", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/sql-for-data-science"},
        {"title": "SQLZoo Interactive", "platform": "Practice", "type": "practice", "url": "https://sqlzoo.net"},
    ],
    "machine learning": [
        {"title": "ML Specialization — Andrew Ng", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/machine-learning-introduction"},
        {"title": "Machine Learning A-Z", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/machinelearning/"},
    ],
    "deep learning": [
        {"title": "Deep Learning Specialization", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/deep-learning"},
        {"title": "PyTorch for Deep Learning", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/pytorch-for-deep-learning/"},
    ],
    "artificial intelligence": [
        {"title": "AI For Everyone — Andrew Ng", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/ai-for-everyone"},
        {"title": "AI & ML Bootcamp", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/"},
    ],
    "data science": [
        {"title": "IBM Data Science Professional", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/ibm-data-science"},
        {"title": "Data Science A-Z", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/datascience/"},
    ],
    "data analysis": [
        {"title": "Google Data Analytics Certificate", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-data-analytics"},
        {"title": "Data Analysis with Pandas", "platform": "Kaggle", "type": "practice", "url": "https://kaggle.com/learn/pandas"},
    ],
    "cybersecurity": [
        {"title": "Google Cybersecurity Certificate", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-cybersecurity"},
        {"title": "Complete Cybersecurity Bootcamp", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/the-complete-cyber-security-course/"},
    ],
    "cloud computing": [
        {"title": "AWS Cloud Practitioner Essentials", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/aws-cloud-practitioner-essentials"},
        {"title": "AWS Skill Builder", "platform": "Practice", "type": "practice", "url": "https://skillbuilder.aws"},
    ],
    "aws": [
        {"title": "AWS Cloud Practitioner", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/aws-cloud-practitioner-essentials"},
        {"title": "AWS Solutions Architect", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/"},
    ],
    "azure": [
        {"title": "Azure Fundamentals AZ-900", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/microsoft-azure-fundamentals"},
        {"title": "Microsoft Learn — Azure", "platform": "Practice", "type": "practice", "url": "https://learn.microsoft.com/en-us/training/azure/"},
    ],
    "docker": [
        {"title": "Docker & Kubernetes Complete Guide", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/docker-and-kubernetes-the-complete-guide/"},
        {"title": "Play with Docker", "platform": "Practice", "type": "practice", "url": "https://labs.play-with-docker.com"},
    ],
    "devops": [
        {"title": "DevOps on AWS Specialization", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/aws-devops"},
        {"title": "DevOps Beginners to Advanced", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/decodingdevops/"},
    ],
    "kubernetes": [
        {"title": "Kubernetes for Beginners", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/learn-kubernetes/"},
        {"title": "Kubernetes Docs Tutorials", "platform": "Practice", "type": "practice", "url": "https://kubernetes.io/docs/tutorials/"},
    ],
    "algorithms": [
        {"title": "Algorithms Specialization — Stanford", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/algorithms"},
        {"title": "LeetCode Top 150", "platform": "LeetCode", "type": "practice", "url": "https://leetcode.com/studyplan/top-interview-150"},
    ],
    "dsa": [
        {"title": "Coding Interview Prep", "platform": "freeCodeCamp", "type": "course", "url": "https://freecodecamp.org/learn/coding-interview-prep"},
        {"title": "LeetCode Top 150", "platform": "LeetCode", "type": "practice", "url": "https://leetcode.com/studyplan/top-interview-150"},
    ],
    "embedded systems": [
        {"title": "Embedded Systems Essentials", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/introduction-embedded-systems"},
        {"title": "Arduino Projects Hub", "platform": "Practice", "type": "practice", "url": "https://projecthub.arduino.cc"},
    ],
    "robotics": [
        {"title": "Robotics Specialization — Penn", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/robotics"},
        {"title": "ROS Tutorials", "platform": "Practice", "type": "practice", "url": "https://wiki.ros.org/ROS/Tutorials"},
    ],
    "git": [
        {"title": "Git & GitHub Bootcamp", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/git-and-github-bootcamp/"},
        {"title": "Learn Git Branching", "platform": "Practice", "type": "practice", "url": "https://learngitbranching.js.org"},
    ],
    "linux": [
        {"title": "Linux Mastery", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/linux-mastery/"},
        {"title": "Linux Journey", "platform": "Practice", "type": "practice", "url": "https://linuxjourney.com"},
    ],
    "typescript": [
        {"title": "Understanding TypeScript", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/understanding-typescript/"},
        {"title": "TypeScript Handbook", "platform": "Practice", "type": "practice", "url": "https://typescriptlang.org/docs/handbook/"},
    ],
    "flutter": [
        {"title": "Flutter & Dart Complete Guide", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/"},
    ],
    "mobile development": [
        {"title": "iOS & Swift Bootcamp", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/ios-13-app-development-bootcamp/"},
        {"title": "Android Development — Kotlin", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/android-app-development"},
    ],
    "blockchain": [
        {"title": "Blockchain Specialization — Buffalo", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/blockchain"},
        {"title": "Ethereum & Solidity", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/"},
    ],
    "api": [
        {"title": "REST API Design", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/rest-api/"},
        {"title": "Postman Learning Center", "platform": "Practice", "type": "practice", "url": "https://learning.postman.com"},
    ],
    "testing": [
        {"title": "Software Testing Bootcamp", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/testerbootcamp/"},
    ],
    "matlab": [
        {"title": "MATLAB Onramp", "platform": "Coursera", "type": "course", "url": "https://matlabacademy.mathworks.com"},
        {"title": "MATLAB Tutorials", "platform": "Practice", "type": "practice", "url": "https://mathworks.com/learn/tutorials.html"},
    ],
    "excel": [
        {"title": "Excel Skills for Business", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/excel"},
        {"title": "Excel Beginner to Advanced", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/"},
    ],
    "power bi": [
        {"title": "Power BI A-Z", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/mspowerbi/"},
        {"title": "Microsoft Power BI Learn", "platform": "Practice", "type": "practice", "url": "https://learn.microsoft.com/en-us/power-bi/"},
    ],
    "tableau": [
        {"title": "Tableau A-Z for Data Science", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/tableau10/"},
        {"title": "Tableau Public Gallery", "platform": "Practice", "type": "practice", "url": "https://public.tableau.com/gallery/"},
    ],
    "networking": [
        {"title": "Networking Fundamentals — CCNA", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/complete-networking-fundamentals-course-ccna-start/"},
        {"title": "Cisco Skills for All", "platform": "Practice", "type": "practice", "url": "https://skillsforall.com"},
    ],

    # ── CREATIVE & DESIGN ─────────────────────────────────────────────────
    "graphic design": [
        {"title": "Graphic Design Specialization — CalArts", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/graphic-design"},
        {"title": "Graphic Design Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/graphic-design-masterclass-everything-you-need-to-know/"},
    ],
    "adobe creative suite": [
        {"title": "Adobe CC Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/adobe-cc-masterclass/"},
        {"title": "Adobe Creative Cloud Tutorials", "platform": "Practice", "type": "practice", "url": "https://helpx.adobe.com/creative-cloud/tutorials-explore.html"},
    ],
    "photoshop": [
        {"title": "Adobe Photoshop CC Essentials", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/adobe-photoshop-cc-essentials-training-course/"},
        {"title": "Photoshop Tutorials — Adobe", "platform": "Practice", "type": "practice", "url": "https://helpx.adobe.com/photoshop/tutorials.html"},
    ],
    "illustrator": [
        {"title": "Adobe Illustrator CC Essentials", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/adobe-illustrator-cc-tutorial/"},
        {"title": "Illustrator Tutorials — Adobe", "platform": "Practice", "type": "practice", "url": "https://helpx.adobe.com/illustrator/tutorials.html"},
    ],
    "indesign": [
        {"title": "Adobe InDesign CC Essentials", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/indesign-cc-essentials/"},
        {"title": "InDesign Tutorials — Adobe", "platform": "Practice", "type": "practice", "url": "https://helpx.adobe.com/indesign/tutorials.html"},
    ],
    "after effects": [
        {"title": "After Effects CC Complete Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/after-effects-kinetic-typography/"},
        {"title": "After Effects Tutorials — Adobe", "platform": "Practice", "type": "practice", "url": "https://helpx.adobe.com/after-effects/tutorials.html"},
    ],
    "premiere pro": [
        {"title": "Premiere Pro CC Complete Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/adobe-premiere-pro-video-editing/"},
        {"title": "Premiere Pro Tutorials — Adobe", "platform": "Practice", "type": "practice", "url": "https://helpx.adobe.com/premiere-pro/tutorials.html"},
    ],
    "figma": [
        {"title": "Google UX Design Certificate", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-ux-design"},
        {"title": "Figma Community Files", "platform": "Practice", "type": "practice", "url": "https://figma.com/community"},
    ],
    "ui design": [
        {"title": "UI/UX Design Bootcamp", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/ui-ux-web-design-using-adobe-xd/"},
        {"title": "Google UX Design Certificate", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-ux-design"},
    ],
    "ux design": [
        {"title": "Google UX Design Certificate", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-ux-design"},
        {"title": "Interaction Design Foundation", "platform": "Practice", "type": "practice", "url": "https://interaction-design.org"},
    ],
    "ux research": [
        {"title": "UX Research & Prototyping", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/ux-research-and-prototyping"},
        {"title": "Nielsen Norman Group", "platform": "Practice", "type": "practice", "url": "https://nngroup.com/articles/"},
    ],
    "color theory": [
        {"title": "Color Theory for Designers", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=color+theory"},
        {"title": "Fundamentals of Graphic Design", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/fundamentals-of-graphic-design"},
    ],
    "typography": [
        {"title": "Introduction to Typography — CalArts", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/typography"},
        {"title": "Typography Fundamentals", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=typography"},
    ],
    "branding": [
        {"title": "Branding: The Creative Journey", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/branding-the-creative-journey"},
        {"title": "Brand Identity Design", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=brand+identity"},
    ],
    "visual design": [
        {"title": "Visual Elements of UI Design", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/visual-elements-user-interface-design"},
        {"title": "Visual Design Fundamentals", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=visual+design"},
    ],
    "design thinking": [
        {"title": "Design Thinking — UVA", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/uva-darden-design-thinking-innovation"},
        {"title": "IDEO Design Thinking", "platform": "Practice", "type": "practice", "url": "https://designthinking.ideo.com"},
    ],
    "motion graphics": [
        {"title": "Motion Graphics in After Effects", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/after-effects-motion-graphics/"},
        {"title": "Motion Design School", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=motion+graphics"},
    ],
    "3d modeling": [
        {"title": "Blender 3D Modeling Complete", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/blendertutorial/"},
        {"title": "Blender Official Tutorials", "platform": "Practice", "type": "practice", "url": "https://blender.org/support/tutorials/"},
    ],
    "blender": [
        {"title": "Complete Blender Creator Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/blendertutorial/"},
        {"title": "Blender Tutorials", "platform": "Practice", "type": "practice", "url": "https://blender.org/support/tutorials/"},
    ],
    "animation": [
        {"title": "2D & 3D Animation — CalArts", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/animation"},
        {"title": "Animation for Beginners", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=animation+beginners"},
    ],
    "illustration": [
        {"title": "Illustration Specialization — CalArts", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/illustration"},
        {"title": "Digital Illustration", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=digital+illustration"},
    ],
    "storyboarding": [
        {"title": "Storyboarding for Film & Animation", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=storyboarding"},
    ],
    "character design": [
        {"title": "Character Art School", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/character-art-school-complete-character-drawing/"},
        {"title": "Character Design for Animation", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=character+design"},
    ],
    "game design": [
        {"title": "Game Design — Michigan State", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/game-design"},
        {"title": "Complete Game Design Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/game-design-complete/"},
    ],
    "unity": [
        {"title": "Complete Unity Developer 3D", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/unitycourse2/"},
        {"title": "Unity Learn Platform", "platform": "Practice", "type": "practice", "url": "https://learn.unity.com"},
    ],
    "unreal engine": [
        {"title": "Unreal Engine 5 Complete Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/unrealcourse/"},
        {"title": "Unreal Online Learning", "platform": "Practice", "type": "practice", "url": "https://dev.epicgames.com/community/unreal-engine/learning"},
    ],
    "photography": [
        {"title": "Photography Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/photography-masterclass-complete-guide-to-photography/"},
        {"title": "Photography Basics — Michigan", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/photography-basics"},
    ],
    "lightroom": [
        {"title": "Lightroom Classic CC Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/adobe-lightroom-classic-cc/"},
        {"title": "Lightroom Tutorials — Adobe", "platform": "Practice", "type": "practice", "url": "https://helpx.adobe.com/lightroom-classic/tutorials.html"},
    ],
    "video editing": [
        {"title": "Video Editing with DaVinci Resolve", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/davinci-resolve-video-editing/"},
        {"title": "DaVinci Resolve Training", "platform": "Practice", "type": "practice", "url": "https://blackmagicdesign.com/products/davinciresolve/training"},
    ],
    "filmmaking": [
        {"title": "Filmmaking Specialization", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/filmmaking"},
        {"title": "Complete Filmmaking Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/filmmaking-masterclass/"},
    ],
    "cinematography": [
        {"title": "Cinematography Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/cinematography-course/"},
    ],
    "screenwriting": [
        {"title": "Screenwriting — Michigan State", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/screenwriting"},
        {"title": "Screenwriting for Beginners", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/screenwriting-for-beginners/"},
    ],
    "fashion design": [
        {"title": "Fashion Design — Parsons", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/fashion-design"},
        {"title": "Fashion Design Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/fashion-design-course/"},
    ],
    "interior design": [
        {"title": "Interior Design Fundamentals", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=interior+design"},
        {"title": "Interior Design 101", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/interior-design-101/"},
    ],
    "autocad": [
        {"title": "AutoCAD Complete Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/autocad-2d-and-3d-practice-drawings/"},
        {"title": "Autodesk Learning", "platform": "Practice", "type": "practice", "url": "https://knowledge.autodesk.com/support/autocad/learn"},
    ],
    "revit": [
        {"title": "Revit Complete Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/autodesk-revit-architecture/"},
    ],
    "architecture": [
        {"title": "Architectural Design — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/architecture"},
        {"title": "Architecture Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=architecture+design"},
    ],
    "solidworks": [
        {"title": "SolidWorks — Become Certified", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/solidworks-become-a-certified-associate-cswa/"},
    ],
    "portfolio": [
        {"title": "Build a Stunning Portfolio", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=build+portfolio"},
        {"title": "Behance — Showcase Work", "platform": "Practice", "type": "practice", "url": "https://behance.net"},
    ],
    "art direction": [
        {"title": "Art Direction Fundamentals", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=art+direction"},
        {"title": "Creative Direction — CalArts", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/graphic-design-history"},
    ],
    "creative direction": [
        {"title": "Brand & Creative Strategy", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/branding-the-creative-journey"},
        {"title": "Creative Direction Masterclass", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=creative+direction"},
    ],
    "industrial design": [
        {"title": "Design Thinking & Innovation", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/design-thinking-innovation"},
        {"title": "Product Design Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/product-design-course/"},
    ],
    "procreate": [
        {"title": "Procreate Masterclass", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=procreate"},
        {"title": "Digital Illustration in Procreate", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/procreate-digital-illustration/"},
    ],
    "digital art": [
        {"title": "Digital Art for Beginners", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=digital+art+beginners"},
        {"title": "Digital Painting Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/digital-art-101/"},
    ],
    "set design": [
        {"title": "Set Design & Scenic Art", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=set+design"},
    ],

    # ── BUSINESS & MANAGEMENT ─────────────────────────────────────────────
    "business strategy": [
        {"title": "Business Foundations — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/wharton-business-foundations"},
        {"title": "Strategic Management", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/strategic-management-and-leadership/"},
    ],
    "project management": [
        {"title": "Google Project Management", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-project-management"},
        {"title": "PMP Exam Prep", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/pmp-pmbok6-35-pdus/"},
    ],
    "agile": [
        {"title": "Agile with Atlassian Jira", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/agile-atlassian-jira"},
        {"title": "Agile & Scrum Master", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/scrum-certification/"},
    ],
    "scrum": [
        {"title": "Scrum Master Certification Prep", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/scrum-certification/"},
        {"title": "Scrum.org Resources", "platform": "Practice", "type": "practice", "url": "https://scrum.org/resources"},
    ],
    "marketing": [
        {"title": "Google Digital Marketing", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-digital-marketing-ecommerce"},
        {"title": "Digital Marketing Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/learn-digital-marketing-course/"},
    ],
    "digital marketing": [
        {"title": "Google Digital Marketing Certificate", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/google-digital-marketing-ecommerce"},
        {"title": "Digital Marketing A-Z", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/learn-digital-marketing-course/"},
    ],
    "seo": [
        {"title": "SEO Specialization — UC Davis", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/seo"},
        {"title": "SEO Training Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/seo-training-masterclass/"},
    ],
    "social media": [
        {"title": "Social Media Marketing — Northwestern", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/social-media-marketing"},
        {"title": "HubSpot Social Media", "platform": "Practice", "type": "practice", "url": "https://academy.hubspot.com/courses/social-media"},
    ],
    "content marketing": [
        {"title": "Content Marketing Strategy", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/content-marketing"},
        {"title": "HubSpot Content Marketing", "platform": "Practice", "type": "practice", "url": "https://academy.hubspot.com/courses/content-marketing"},
    ],
    "brand strategy": [
        {"title": "Brand Management — IE Business", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/brand-management"},
        {"title": "Brand Strategy Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/brand-strategy/"},
    ],
    "supply chain": [
        {"title": "Supply Chain Management — Rutgers", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/supply-chain-management"},
        {"title": "Supply Chain Fundamentals", "platform": "edX", "type": "course", "url": "https://edx.org/learn/supply-chain-management"},
    ],
    "operations management": [
        {"title": "Operations Management — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/wharton-operations"},
        {"title": "Operations Management A-Z", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/operations-management-a-z/"},
    ],
    "human resources": [
        {"title": "HR Management — Minnesota", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/human-resource-management"},
        {"title": "HR Analytics Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/hr-analytics-course/"},
    ],
    "entrepreneurship": [
        {"title": "Entrepreneurship — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/wharton-entrepreneurship"},
        {"title": "Startup Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/how-to-build-a-startup/"},
    ],
    "consulting": [
        {"title": "Management Consulting — Emory", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/management-consulting"},
        {"title": "Case Interview Prep", "platform": "Practice", "type": "practice", "url": "https://mckinsey.com/careers/interviewing"},
    ],
    "negotiation": [
        {"title": "Successful Negotiation — Michigan", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/negotiation"},
        {"title": "Negotiation Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/negotiation/"},
    ],
    "sales": [
        {"title": "Sales Training for High Performers", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/sales-training-practical-sales-techniques/"},
        {"title": "HubSpot Inbound Sales", "platform": "Practice", "type": "practice", "url": "https://academy.hubspot.com/courses/inbound-sales"},
    ],
    "management": [
        {"title": "Principles of Management", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/principles-of-management"},
        {"title": "New Manager Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/new-manager-masterclass/"},
    ],
    "leadership": [
        {"title": "Foundations of Leadership — Illinois", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/foundations-of-everyday-leadership"},
        {"title": "Leadership Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/leadership-masterclass/"},
    ],
    "business analytics": [
        {"title": "Business Analytics — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/business-analytics"},
        {"title": "Business Analysis Fundamentals", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/business-analysis-fundamentals/"},
    ],
    "product management": [
        {"title": "Digital Product Management — UVA", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/uva-darden-digital-product-management"},
        {"title": "Product Management A-Z", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/product-management-complete/"},
    ],
    "crm": [
        {"title": "Salesforce Administrator", "platform": "Coursera", "type": "course", "url": "https://coursera.org/professional-certificates/salesforce-administrator"},
        {"title": "HubSpot CRM Course", "platform": "Practice", "type": "practice", "url": "https://academy.hubspot.com/courses/hubspot-crm"},
    ],

    # ── FINANCE & ECONOMICS ───────────────────────────────────────────────
    "financial modeling": [
        {"title": "Financial Modeling — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/wharton-quantitative-modeling"},
        {"title": "Financial Modeling & Valuation", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/the-complete-financial-analyst-course/"},
    ],
    "financial analysis": [
        {"title": "Financial Management — Illinois", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/financial-management"},
        {"title": "Complete Finance Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/the-complete-financial-analyst-course/"},
    ],
    "accounting": [
        {"title": "Accounting Fundamentals — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/wharton-accounting"},
        {"title": "Accounting & Bookkeeping", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/accounting-basics/"},
    ],
    "investment banking": [
        {"title": "Investment Management", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/investment-management"},
        {"title": "Investment Banking Fundamentals", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/investment-banking-fundamentals/"},
    ],
    "stock market": [
        {"title": "Financial Markets — Yale", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/financial-markets-global"},
        {"title": "Stock Trading A-Z", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/investing-in-stocks/"},
    ],
    "trading": [
        {"title": "Technical Analysis Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/technical-analysis-masterclass/"},
        {"title": "Investopedia Simulator", "platform": "Practice", "type": "practice", "url": "https://investopedia.com/simulator/"},
    ],
    "taxation": [
        {"title": "Federal Taxation — Illinois", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/tax"},
        {"title": "Tax Preparation Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/income-tax/"},
    ],
    "economics": [
        {"title": "Microeconomics — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/microeconomics"},
        {"title": "Economics — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/economics-finance-domain"},
    ],
    "actuarial": [
        {"title": "Actuarial Science Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=actuarial"},
        {"title": "Coaching Actuaries", "platform": "Practice", "type": "practice", "url": "https://coaching.actuaries.org"},
    ],
    "risk management": [
        {"title": "Financial Risk Management — NYU", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/financial-risk-management"},
        {"title": "FRM Exam Prep", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/frm-part-1/"},
    ],
    "cryptocurrency": [
        {"title": "Bitcoin & Crypto — Princeton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/cryptocurrency"},
        {"title": "Blockchain & Crypto", "platform": "edX", "type": "course", "url": "https://edx.org/learn/blockchain"},
    ],
    "personal finance": [
        {"title": "Personal Finance — Purdue", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/personal-finance"},
        {"title": "Finance 101 — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/economics-finance-domain/core-finance"},
    ],
    "budgeting": [
        {"title": "Budgeting & Finance Essentials", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/personal-finance"},
        {"title": "Finance Fundamentals", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/economics-finance-domain/core-finance"},
    ],
    "cfa": [
        {"title": "CFA Level 1 Complete Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/cfa-level-1/"},
        {"title": "CFA Institute Resources", "platform": "Practice", "type": "practice", "url": "https://cfainstitute.org/en/programs/cfa/curriculum"},
    ],
    "audit": [
        {"title": "Auditing Fundamentals", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=auditing"},
    ],
    "valuation": [
        {"title": "Valuation & Financial Modeling", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/wharton-quantitative-modeling"},
    ],

    # ── HEALTHCARE & MEDICINE ─────────────────────────────────────────────
    "anatomy": [
        {"title": "Human Anatomy — Michigan", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/anatomy"},
        {"title": "Health & Medicine — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/health-and-medicine"},
    ],
    "physiology": [
        {"title": "Introductory Physiology — Duke", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/physiology"},
        {"title": "Medical Physiology", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/health-and-medicine"},
    ],
    "pharmacology": [
        {"title": "Pharmacology Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=pharmacology"},
        {"title": "Pharmacology Made Easy", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/pharmacology-made-easy/"},
    ],
    "public health": [
        {"title": "Public Health — Johns Hopkins", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/public-health"},
        {"title": "Epidemiology for Public Health", "platform": "edX", "type": "course", "url": "https://edx.org/learn/epidemiology"},
    ],
    "epidemiology": [
        {"title": "Epidemiology — Johns Hopkins", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/epidemiology"},
    ],
    "clinical research": [
        {"title": "Clinical Trials — Vanderbilt", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/clinical-trials"},
        {"title": "Good Clinical Practice", "platform": "Practice", "type": "practice", "url": "https://gcp.nidatraining.org"},
    ],
    "nursing": [
        {"title": "Nursing Informatics", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=nursing"},
        {"title": "Health & Medicine — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/health-and-medicine"},
    ],
    "first aid": [
        {"title": "First Aid Basics", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/first-aid"},
        {"title": "Red Cross Training", "platform": "Practice", "type": "practice", "url": "https://redcross.org/take-a-class"},
    ],
    "nutrition": [
        {"title": "Nutrition Science — Stanford", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/food-and-health"},
        {"title": "Nutrition Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/nutrition-masterclass/"},
    ],
    "mental health": [
        {"title": "Psychological First Aid", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/psychological-first-aid"},
    ],
    "psychology": [
        {"title": "Introduction to Psychology — Yale", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/introduction-psychology"},
        {"title": "Psychology — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/health-and-medicine/mental-health"},
    ],
    "counseling": [
        {"title": "Counseling Psychology", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/psychological-first-aid"},
        {"title": "APA Career Resources", "platform": "Practice", "type": "practice", "url": "https://apa.org/education-career"},
    ],
    "physiotherapy": [
        {"title": "Physical Therapy Foundations", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=physiotherapy"},
    ],
    "patient care": [
        {"title": "Patient Safety — Johns Hopkins", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/patient-safety"},
    ],

    # ── LAW & POLICY ──────────────────────────────────────────────────────
    "constitutional law": [
        {"title": "Constitutional Law — Yale", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/constitutional-law"},
        {"title": "US Government — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/humanities/us-government-and-civics"},
    ],
    "corporate law": [
        {"title": "Corporate & Commercial Law", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=corporate+law"},
        {"title": "Business Law Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/business-law/"},
    ],
    "criminal law": [
        {"title": "Criminal Law — UPenn", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/criminal-law"},
    ],
    "contract law": [
        {"title": "Contract Law — Harvard", "platform": "edX", "type": "course", "url": "https://edx.org/learn/contract-law"},
    ],
    "intellectual property": [
        {"title": "IP Law — UPenn", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/intellectual-property"},
        {"title": "WIPO Academy", "platform": "Practice", "type": "practice", "url": "https://wipo.int/academy/en/"},
    ],
    "legal writing": [
        {"title": "Legal Writing & Research", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=legal+writing"},
    ],
    "compliance": [
        {"title": "Compliance Management", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=compliance"},
        {"title": "Compliance Training", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/compliance-management/"},
    ],
    "policy analysis": [
        {"title": "Public Policy Analysis", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=public+policy"},
        {"title": "Policy Analysis — edX", "platform": "edX", "type": "course", "url": "https://edx.org/learn/public-policy"},
    ],
    "international law": [
        {"title": "International Law — Louvain", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/international-law"},
    ],
    "human rights": [
        {"title": "Human Rights — Curtin", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/human-rights"},
        {"title": "UN Human Rights Resources", "platform": "Practice", "type": "practice", "url": "https://ohchr.org/en/resources"},
    ],
    "mediation": [
        {"title": "Conflict Management — UC Irvine", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/conflict-management"},
    ],
    "governance": [
        {"title": "Corporate Governance", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=corporate+governance"},
    ],

    # ── SCIENCE & RESEARCH ────────────────────────────────────────────────
    "research methodology": [
        {"title": "Research Methods — London", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/research-methods"},
        {"title": "Research Skills", "platform": "edX", "type": "course", "url": "https://edx.org/learn/research"},
    ],
    "scientific writing": [
        {"title": "Writing in the Sciences — Stanford", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/sciwrite"},
        {"title": "Purdue OWL Writing Lab", "platform": "Practice", "type": "practice", "url": "https://owl.purdue.edu"},
    ],
    "statistics": [
        {"title": "Statistics with Python", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/statistics-with-python"},
        {"title": "Statistics — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/math/statistics-probability"},
    ],
    "r programming": [
        {"title": "R Programming — Johns Hopkins", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/r-programming"},
        {"title": "R for Data Science", "platform": "Practice", "type": "practice", "url": "https://r4ds.had.co.nz"},
    ],
    "spss": [
        {"title": "SPSS Essential Training", "platform": "LinkedIn Learning", "type": "course", "url": "https://linkedin.com/learning/spss-statistics-essential-training"},
    ],
    "bioinformatics": [
        {"title": "Bioinformatics — UCSD", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/bioinformatics"},
    ],
    "chemistry": [
        {"title": "Chemistry — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/chemistry"},
        {"title": "Chemistry — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/chemistry"},
    ],
    "organic chemistry": [
        {"title": "Organic Chemistry — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/organic-chemistry"},
    ],
    "physics": [
        {"title": "Physics — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/physics"},
        {"title": "Physics — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/physics"},
    ],
    "biology": [
        {"title": "Biology — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/biology"},
        {"title": "Biology — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/biology"},
    ],
    "genetics": [
        {"title": "Genetics & Society — Duke", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/genetics-and-society"},
    ],
    "microbiology": [
        {"title": "Microbiology Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=microbiology"},
    ],
    "environmental science": [
        {"title": "Environmental Science Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=environmental+science"},
        {"title": "Sustainability — edX", "platform": "edX", "type": "course", "url": "https://edx.org/learn/sustainability"},
    ],
    "lab techniques": [
        {"title": "Lab Techniques & Safety", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=laboratory+techniques"},
    ],

    # ── EDUCATION & SOCIAL ────────────────────────────────────────────────
    "pedagogy": [
        {"title": "Foundations of Teaching — UPenn", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/teach"},
        {"title": "Teaching Methods", "platform": "edX", "type": "course", "url": "https://edx.org/learn/teaching"},
    ],
    "curriculum design": [
        {"title": "Curriculum & Teaching", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=curriculum+design"},
    ],
    "classroom management": [
        {"title": "Classroom Management Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=classroom+management"},
    ],
    "instructional design": [
        {"title": "Instructional Design — UIUC", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/instructional-design"},
        {"title": "Instructional Design Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/instructional-design/"},
    ],
    "e-learning": [
        {"title": "E-Learning Development", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=e-learning"},
        {"title": "Articulate Storyline", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/articulate-storyline/"},
    ],
    "child development": [
        {"title": "Child Development — Harvard", "platform": "edX", "type": "course", "url": "https://edx.org/learn/child-development"},
    ],
    "special education": [
        {"title": "Special Education Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=special+education"},
    ],
    "social work": [
        {"title": "Social Work Practice", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=social+work"},
        {"title": "NASW Resources", "platform": "Practice", "type": "practice", "url": "https://socialworkers.org/Practice"},
    ],

    # ── MEDIA & COMMUNICATION ─────────────────────────────────────────────
    "journalism": [
        {"title": "Journalism for Social Change", "platform": "edX", "type": "course", "url": "https://edx.org/learn/journalism"},
        {"title": "Journalism Fundamentals", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=journalism"},
    ],
    "public relations": [
        {"title": "PR & Corporate Communications", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=public+relations"},
        {"title": "Public Relations Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/public-relations/"},
    ],
    "copywriting": [
        {"title": "Copywriting Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/the-ultimate-copywriting-course/"},
        {"title": "Copywriting for Beginners", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=copywriting"},
    ],
    "content writing": [
        {"title": "Content Writing Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/content-writing-masterclass/"},
    ],
    "podcasting": [
        {"title": "Podcasting Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/how-to-create-a-podcast/"},
        {"title": "Podcast Production", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=podcasting"},
    ],
    "advertising": [
        {"title": "Advertising & Creativity — Colorado", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/creativity-advertising"},
        {"title": "Google Ads Certification", "platform": "Practice", "type": "practice", "url": "https://skillshop.withgoogle.com"},
    ],
    "email marketing": [
        {"title": "Email Marketing Mastery", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/email-marketing-mastery/"},
        {"title": "HubSpot Email Marketing", "platform": "Practice", "type": "practice", "url": "https://academy.hubspot.com/courses/email-marketing"},
    ],

    # ── ARTS & CULTURE ────────────────────────────────────────────────────
    "music theory": [
        {"title": "Music Theory — Berklee", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/music-theory"},
        {"title": "Music — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/humanities/music"},
    ],
    "music production": [
        {"title": "Music Production — Berklee", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/music-production"},
        {"title": "Music Production in Ableton", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/ableton-live-course/"},
    ],
    "songwriting": [
        {"title": "Songwriting — Berklee", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/songwriting"},
    ],
    "mixing": [
        {"title": "Mixing & Mastering Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/mixing-and-mastering/"},
    ],
    "ableton": [
        {"title": "Ableton Live Complete Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/ableton-live-course/"},
    ],
    "fl studio": [
        {"title": "FL Studio Complete Guide", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/fl-studio-course/"},
    ],
    "piano": [
        {"title": "Piano for All — Incredible Method", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/pianoforall-incredible-new-way-to-learn-piano-keyboard/"},
    ],
    "guitar": [
        {"title": "Guitar in 21 Days", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/guitar-in-21-days/"},
        {"title": "Justin Guitar", "platform": "Practice", "type": "practice", "url": "https://justinguitar.com"},
    ],
    "acting": [
        {"title": "Acting Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/acting-classes/"},
        {"title": "Acting for Beginners", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=acting"},
    ],
    "creative writing": [
        {"title": "Creative Writing — Wesleyan", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/creative-writing"},
        {"title": "Creative Writing Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/creative-writing-masterclass/"},
    ],
    "art history": [
        {"title": "Modern Art — MoMA", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/modern-art"},
        {"title": "Art History — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/humanities/art-history"},
    ],
    "dance": [
        {"title": "Dance & Movement", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=dance"},
    ],
    "choreography": [
        {"title": "Choreography Fundamentals", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=choreography"},
    ],
    "painting": [
        {"title": "Painting for Beginners", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=painting+beginners"},
        {"title": "Acrylic Painting Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/acrylic-painting/"},
    ],
    "sculpture": [
        {"title": "Sculpture & 3D Forms", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=sculpture"},
    ],
    "ceramics": [
        {"title": "Ceramics & Pottery", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=ceramics+pottery"},
    ],
    "curation": [
        {"title": "Museum Studies", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=museum+studies"},
    ],
    "event production": [
        {"title": "Event Planning & Management", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=event+management"},
        {"title": "Event Planning Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/event-planning/"},
    ],

    # ── SPORTS & WELLNESS ─────────────────────────────────────────────────
    "sports science": [
        {"title": "Exercise Science — Colorado", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/exercise-science"},
        {"title": "Sports Science", "platform": "edX", "type": "course", "url": "https://edx.org/learn/sports-science"},
    ],
    "fitness training": [
        {"title": "NASM CPT Exam Prep", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/nasm-cpt-exam-prep/"},
        {"title": "ACE Fitness Resources", "platform": "Practice", "type": "practice", "url": "https://acefitness.org/resources/pros/"},
    ],
    "personal training": [
        {"title": "Personal Trainer Certification Prep", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/nasm-cpt-exam-prep/"},
    ],
    "sports coaching": [
        {"title": "Coaching Athletes", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=sports+coaching"},
    ],
    "sports nutrition": [
        {"title": "Sports Nutrition — Barcelona", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/sports-nutrition"},
    ],
    "yoga": [
        {"title": "Yoga Teacher Training", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/yoga-teacher-training/"},
    ],
    "meditation": [
        {"title": "Mindfulness & Meditation", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/mindfulness-meditation"},
    ],
    "sports management": [
        {"title": "Sports Management — Michigan", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/sports-management"},
    ],
    "strength training": [
        {"title": "Strength Training Anatomy", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/strength-training/"},
    ],
    "sports medicine": [
        {"title": "Sports Medicine Fundamentals", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=sports+medicine"},
    ],

    # ── TRADES & SKILLED WORK ─────────────────────────────────────────────
    "culinary arts": [
        {"title": "Culinary Science Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=culinary"},
        {"title": "Professional Chef Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/professional-chef/"},
    ],
    "cooking": [
        {"title": "Cooking Techniques", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/cooking-for-beginners/"},
    ],
    "pastry": [
        {"title": "Pastry & Baking Arts", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=pastry+baking"},
    ],
    "hospitality": [
        {"title": "Hotel Management — Cornell", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/hotel-management"},
        {"title": "Hospitality & Tourism", "platform": "edX", "type": "course", "url": "https://edx.org/learn/hospitality"},
    ],
    "hotel management": [
        {"title": "Hotel Management — Cornell", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/hotel-management"},
    ],
    "real estate": [
        {"title": "Real Estate Investment", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=real+estate"},
        {"title": "Real Estate License Prep", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/real-estate-license/"},
    ],
    "event management": [
        {"title": "Event Planning & Management", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=event+management"},
        {"title": "Event Planning Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/event-planning/"},
    ],
    "wedding planning": [
        {"title": "Wedding Planning Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/wedding-planner/"},
    ],
    "electrical": [
        {"title": "Electrical Engineering — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/electrical-engineering"},
        {"title": "Electrical Wiring Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/electrical-wiring/"},
    ],
    "cnc": [
        {"title": "CNC Machining & Programming", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/cnc-programming/"},
    ],
    "carpentry": [
        {"title": "Woodworking Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/woodworking/"},
        {"title": "Woodworking Projects", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=woodworking"},
    ],
    "aviation": [
        {"title": "Aviation Fundamentals", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=aviation"},
    ],
    "pilot": [
        {"title": "Private Pilot Ground School", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/private-pilot/"},
    ],
    "jewelry design": [
        {"title": "Jewelry Design & Making", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=jewelry+design"},
        {"title": "Jewelry Making Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/jewelry-making/"},
    ],
    "sommelier": [
        {"title": "Wine & Sommelier Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/wine-course/"},
    ],
    "tattoo": [
        {"title": "Tattoo Art & Design", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=tattoo+design"},
    ],

    # ── ENGINEERING SPECIFIC ──────────────────────────────────────────────
    "civil engineering": [
        {"title": "Civil Engineering Courses", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=civil+engineering"},
        {"title": "Structural Engineering", "platform": "edX", "type": "course", "url": "https://edx.org/learn/structural-engineering"},
    ],
    "mechanical engineering": [
        {"title": "Mechanical Engineering — Georgia Tech", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=mechanical+engineering"},
    ],
    "electrical engineering": [
        {"title": "Electrical Engineering — Khan Academy", "platform": "Khan Academy", "type": "course", "url": "https://khanacademy.org/science/electrical-engineering"},
        {"title": "Electrical Engineering — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/electrical-engineering"},
    ],
    "chemical engineering": [
        {"title": "Chemical Engineering — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/chemical-engineering"},
    ],
    "aerospace engineering": [
        {"title": "Aerospace Engineering — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/aerospace-engineering"},
    ],
    "biomedical engineering": [
        {"title": "Biomedical Engineering — Johns Hopkins", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=biomedical+engineering"},
    ],
    "thermodynamics": [
        {"title": "Thermodynamics — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/learn/thermodynamics"},
    ],
    "circuit design": [
        {"title": "Circuit Design — Georgia Tech", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=circuit+design"},
    ],

    # ── COMMUNICATION & SOFT SKILLS ───────────────────────────────────────
    "communication": [
        {"title": "Communication Skills — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/wharton-communication-skills"},
        {"title": "Communication Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/communication-skills-masterclass/"},
    ],
    "public speaking": [
        {"title": "Public Speaking — UW", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/public-speaking"},
        {"title": "Public Speaking Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/public-speaking-masterclass/"},
    ],
    "presentation": [
        {"title": "Presentation Skills", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=presentation+skills"},
        {"title": "PowerPoint & Presentation Design", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/powerpoint-presentation/"},
    ],
    "writing": [
        {"title": "Good with Words — Michigan", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/good-with-words"},
        {"title": "Purdue OWL Writing Lab", "platform": "Practice", "type": "practice", "url": "https://owl.purdue.edu"},
    ],
    "research": [
        {"title": "Research Methods", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/research-methods"},
    ],
    "critical thinking": [
        {"title": "Critical Thinking — Duke", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/critical-thinking"},
    ],
    "problem solving": [
        {"title": "Creative Problem Solving", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/creative-problem-solving"},
    ],
    "teamwork": [
        {"title": "Teamwork Skills — Colorado", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/teamwork-skills"},
    ],
    "time management": [
        {"title": "Time Management Mastery", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/time-management-mastery/"},
    ],

    # ── CAREER / NETWORKING ───────────────────────────────────────────────
    "linkedin": [
        {"title": "LinkedIn Marketing Course", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/linkedin-marketing/"},
        {"title": "LinkedIn Learning", "platform": "LinkedIn Learning", "type": "practice", "url": "https://linkedin.com/learning"},
    ],
    "resume": [
        {"title": "Resume Writing Guide", "platform": "Practice", "type": "practice", "url": "https://resumeworded.com"},
    ],
    "interview": [
        {"title": "Interview Skills", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=interview+skills"},
        {"title": "Interview Prep — Exponent", "platform": "Practice", "type": "practice", "url": "https://tryexponent.com"},
    ],
    "freelancing": [
        {"title": "Freelancing Masterclass", "platform": "Udemy", "type": "course", "url": "https://udemy.com/course/how-to-be-a-successful-freelancer/"},
        {"title": "Freelancing Guide", "platform": "Skillshare", "type": "course", "url": "https://skillshare.com/search?query=freelancing"},
    ],
    "internship": [
        {"title": "Career Development", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=career+development"},
        {"title": "Internshala", "platform": "Practice", "type": "practice", "url": "https://internshala.com"},
    ],
    "personal branding": [
        {"title": "Personal Branding", "platform": "Coursera", "type": "course", "url": "https://coursera.org/courses?query=personal+branding"},
    ],
}


# ══════════════════════════════════════════════════════════════════════════
# DOMAIN-LEVEL FALLBACK — YouTube search hints per domain
# Used when no specific skill match is found
# ══════════════════════════════════════════════════════════════════════════

DOMAIN_SEARCH_HINTS = {
    "Technology & Engineering": "software engineering career roadmap tutorial",
    "Business & Management": "business management career skills tutorial",
    "Creative & Design": "creative design career skills portfolio tutorial",
    "Science & Research": "science research career guide tutorial",
    "Healthcare & Medicine": "healthcare medical career guide tutorial",
    "Law & Policy": "law career legal skills tutorial",
    "Education & Social": "education teaching career skills tutorial",
    "Media & Communication": "media communication career skills tutorial",
    "Finance & Economics": "finance economics career guide tutorial",
    "Arts & Culture": "arts culture creative career tutorial",
    "Sports & Wellness": "sports fitness wellness career tutorial",
    "Trades & Skilled Work": "skilled trades career guide tutorial",
}

# Domain-level curated fallback courses
DOMAIN_FALLBACK_COURSES = {
    "Technology & Engineering": {"title": "CS50 — Intro to Computer Science", "platform": "edX", "type": "course", "url": "https://edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science"},
    "Business & Management": {"title": "Business Foundations — Wharton", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/wharton-business-foundations"},
    "Creative & Design": {"title": "Graphic Design — CalArts", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/graphic-design"},
    "Science & Research": {"title": "Science & Engineering — MIT", "platform": "edX", "type": "course", "url": "https://edx.org/school/mitx"},
    "Healthcare & Medicine": {"title": "Health Informatics — Johns Hopkins", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/health-informatics"},
    "Law & Policy": {"title": "Introduction to Law", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/introduction-to-law"},
    "Education & Social": {"title": "Foundations of Teaching — UPenn", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/teach"},
    "Media & Communication": {"title": "Content Strategy — Northwestern", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/content-marketing"},
    "Finance & Economics": {"title": "Financial Markets — Yale", "platform": "Coursera", "type": "course", "url": "https://coursera.org/learn/financial-markets-global"},
    "Arts & Culture": {"title": "Modern Art — MoMA", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/modern-art"},
    "Sports & Wellness": {"title": "Exercise Science — Colorado", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/exercise-science"},
    "Trades & Skilled Work": {"title": "Hotel Management — Cornell", "platform": "Coursera", "type": "course", "url": "https://coursera.org/specializations/hotel-management"},
}


# ══════════════════════════════════════════════════════════════════════════
# YOUTUBE DATA API v3 INTEGRATION
# ══════════════════════════════════════════════════════════════════════════

@lru_cache(maxsize=512)
def _youtube_search(query: str, max_results: int = 1) -> tuple:
    """
    Search YouTube via Data API v3.
    Returns tuple of resource dicts (tuple for lru_cache hashability).
    """
    if not YOUTUBE_API_KEY:
        return ()

    try:
        params = urllib.parse.urlencode({
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": max_results,
            "relevanceLanguage": "en",
            "videoDuration": "medium",
            "key": YOUTUBE_API_KEY,
        })
        url = f"{YT_SEARCH_URL}?{params}"
        req = urllib.request.Request(url, headers={"Accept": "application/json"})

        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())

        results = []
        for item in data.get("items", []):
            vid = item["id"].get("videoId", "")
            title = item["snippet"].get("title", "YouTube Tutorial")
            channel = item["snippet"].get("channelTitle", "")
            if vid:
                display = title[:55] if len(title) > 55 else title
                results.append({
                    "title": display,
                    "platform": "YouTube",
                    "type": "course",
                    "url": f"https://youtube.com/watch?v={vid}",
                })
        return tuple(tuple(sorted(r.items())) for r in results)

    except Exception as e:
        logger.warning(f"YouTube API search failed: {e}")
        return ()


def _fetch_youtube(search_query: str) -> list:
    """Get 1 YouTube video for a search query. Returns list of 0-1 dicts."""
    raw = _youtube_search(search_query, 1)
    return [dict(r) for r in raw[:1]]


# ══════════════════════════════════════════════════════════════════════════
# SMART MATCHING ENGINE
# ══════════════════════════════════════════════════════════════════════════

# Words to strip from action text before matching
ACTION_VERBS = frozenset({
    "learn", "study", "master", "develop", "practice", "build", "create",
    "complete", "earn", "take", "enroll", "start", "begin", "improve",
    "attend", "join", "get", "obtain", "pursue", "work", "gain", "acquire",
    "focus", "explore", "understand", "strengthen", "enhance", "hone",
    "deepen", "expand", "cultivate", "refine", "advance", "establish",
})

FILLER_WORDS = frozenset({
    "in", "on", "for", "the", "a", "an", "to", "with", "your", "and",
    "or", "of", "by", "at", "from", "into", "through", "about", "this",
    "that", "these", "those", "such", "like", "including", "via", "within",
    "skills", "knowledge", "expertise", "proficiency", "certification",
    "courses", "course", "training", "programs", "program", "techniques",
    "principles", "fundamentals", "basics", "concepts", "industry",
    "professional", "relevant", "specific", "related", "key", "core",
    "essential", "critical", "important", "current", "modern", "advanced",
    "begin", "continue", "ongoing",
})


def _normalize(text: str) -> str:
    """Normalize text for matching — lowercase, strip punctuation."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s/&+\-]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def _extract_topic_phrases(action_text: str) -> list:
    """
    Extract meaningful topic phrases from an action string.
    Returns phrases from most-specific (longest) to least-specific (single words).
    """
    text = _normalize(action_text)
    words = text.split()

    # Strip leading action verbs
    while words and words[0] in ACTION_VERBS:
        words.pop(0)

    # Strip trailing filler words
    while words and words[-1] in FILLER_WORDS:
        words.pop()

    # Filter out remaining filler words for clean phrases
    clean = [w for w in words if w not in FILLER_WORDS and len(w) > 1]

    phrases = []

    # Full cleaned phrase
    if len(clean) >= 2:
        phrases.append(" ".join(clean))

    # 3-word sliding windows
    for i in range(len(clean) - 2):
        phrases.append(" ".join(clean[i:i + 3]))

    # 2-word sliding windows
    for i in range(len(clean) - 1):
        phrases.append(" ".join(clean[i:i + 2]))

    # Single words (4+ chars, not filler/verbs)
    for w in clean:
        if len(w) >= 4 and w not in ACTION_VERBS:
            phrases.append(w)

    return phrases


def _find_curated_match(phrases: list) -> list:
    """Find best curated resource from RESOURCE_MAP given topic phrases."""
    for phrase in phrases:
        # Exact key match
        if phrase in RESOURCE_MAP:
            return RESOURCE_MAP[phrase][:1]

    for phrase in phrases:
        # Key contained in phrase, or phrase contained in key
        for key in RESOURCE_MAP:
            if key in phrase or phrase in key:
                return RESOURCE_MAP[key][:1]

    return []


def _find_skill_match(action_text: str, missing_skills: list) -> list:
    """Check if any missing_skill appears in the action text."""
    text_lower = action_text.lower()
    for skill in missing_skills:
        if skill.lower() in text_lower:
            # Try to find curated resource for this skill
            skill_norm = _normalize(skill)
            if skill_norm in RESOURCE_MAP:
                return RESOURCE_MAP[skill_norm][:1]
            # Partial match
            for key in RESOURCE_MAP:
                if skill_norm in key or key in skill_norm:
                    return RESOURCE_MAP[key][:1]
    return []


# ══════════════════════════════════════════════════════════════════════════
# PUBLIC API
# ══════════════════════════════════════════════════════════════════════════

def get_resources_for_action(
    action_text: str,
    missing_skills: list = None,
    target_role: str = "",
    target_domain: str = "",
) -> list:
    """
    Get 1-2 resources for a roadmap action.

    Strategy:
      1. Try matching action text against curated RESOURCE_MAP (topic phrases)
      2. Try matching against missing_skills
      3. Fetch 1 YouTube video via API for the action topic
      4. If no curated match, use domain fallback course
      5. Combine: up to 1 curated + 1 YouTube = 2 resources
    """
    missing_skills = missing_skills or []
    resources = []

    # ── Step 1: Topic phrase matching against curated map ─────────
    phrases = _extract_topic_phrases(action_text)
    curated = _find_curated_match(phrases)

    # ── Step 2: Missing skills matching ──────────────────────────
    if not curated:
        curated = _find_skill_match(action_text, missing_skills)

    # ── Step 3: Domain fallback ──────────────────────────────────
    if not curated and target_domain:
        fallback = DOMAIN_FALLBACK_COURSES.get(target_domain)
        if fallback:
            curated = [fallback]

    if curated:
        resources.extend(curated[:1])

    # ── Step 4: YouTube API — always try for a relevant video ────
    if YOUTUBE_API_KEY:
        # Build a smart search query
        search_parts = []
        if phrases:
            # Use the most specific phrase (first one)
            search_parts.append(phrases[0])
        else:
            search_parts.append(_normalize(action_text))

        if target_role:
            search_parts.append(target_role.lower())

        search_query = " ".join(search_parts) + " tutorial"
        yt_results = _fetch_youtube(search_query)

        for yt in yt_results:
            # Don't add duplicate YouTube if curated was already YouTube
            if not any(r.get("platform") == "YouTube" for r in resources):
                resources.append(yt)

    # ── Ensure at least 1 resource ───────────────────────────────
    if not resources:
        # Static YouTube search link as absolute fallback
        query = _normalize(action_text)[:60].replace(" ", "+")
        resources.append({
            "title": f"Search: {_normalize(action_text)[:40]}",
            "platform": "YouTube",
            "type": "course",
            "url": f"https://youtube.com/results?search_query={query}+tutorial",
        })

    return resources[:2]


def get_resources_for_skills(skills: list) -> dict:
    """
    Return curated + YouTube resources for a list of skill names.
    Used by /api/skill-resources endpoint for market page.

    Returns: { "skill_name": [ {title, platform, type, url}, ... ], ... }
    """
    result = {}
    for skill in skills:
        skill_norm = _normalize(skill)
        resources = []

        # 1. Exact curated match
        if skill_norm in RESOURCE_MAP:
            resources.extend(RESOURCE_MAP[skill_norm][:2])
        else:
            # 2. Partial match — key in skill or skill in key
            for key in RESOURCE_MAP:
                if skill_norm in key or key in skill_norm:
                    resources.extend(RESOURCE_MAP[key][:2])
                    break

        # 3. YouTube — always try for a video
        if YOUTUBE_API_KEY:
            yt_results = _fetch_youtube(f"{skill} tutorial course")
            for vid in yt_results[:1]:
                # Avoid duplicates
                if not any(r.get("url") == vid.get("url") for r in resources):
                    resources.append(vid)

        # 4. Generic search fallback if nothing found
        if not resources:
            resources.append({
                "title": f"Learn {skill}",
                "platform": "Google",
                "type": "search",
                "url": f"https://www.google.com/search?q=learn+{urllib.parse.quote(skill)}+course",
            })

        result[skill] = resources[:3]   # max 3 per skill

    return result


def enrich_roadmap_with_resources(
    roadmap: dict,
    missing_skills: list,
    target_role: str = "",
    target_domain: str = "",
) -> dict:
    """
    Attach 1-2 curated/YouTube resources to each roadmap action.

    Args:
        roadmap: Dict with phase_1, phase_2, phase_3 keys
        missing_skills: List of skill gaps identified for the user
        target_role: The career role the user is targeting
        target_domain: The domain (e.g., "Creative & Design")
    """
    for phase_key in ["phase_1", "phase_2", "phase_3"]:
        phase = roadmap.get(phase_key, {})
        enriched_actions = []

        for action in phase.get("actions", []):
            # Handle already-enriched actions
            action_text = action if isinstance(action, str) else action.get("action", "")

            resources = get_resources_for_action(
                action_text,
                missing_skills=missing_skills,
                target_role=target_role,
                target_domain=target_domain,
            )

            enriched_actions.append({
                "action": action_text,
                "resources": resources,
            })

        phase["actions"] = enriched_actions

    return roadmap
