window.PORTFOLIO_DATA = [
  {
    "id": "onpole-wearable-pcb",
    "label": "PCB Design / Embedded Hardware",
    "title": "OnPole Six-Layer Wearable PCB",
    "description": "All five design milestones approved; the controlled six-layer board release entered production. Physical bring-up and measured wearable/RF validation are still pending.",
    "tags": [
      "KiCad",
      "ESP32-S3",
      "6-Layer PCB",
      "GNSS / RF",
      "Manufacturing Release"
    ],
    "images": [
      {
        "src": "assets/projects/onpole-wearable-pcb/top-view.png",
        "alt": "Six-layer ESP32-S3 wearable PCB top 3D view",
        "type": "image"
      },
      {
        "src": "assets/projects/onpole-wearable-pcb/bottom-view.png",
        "alt": "Six-layer ESP32-S3 wearable PCB bottom 3D view with Qi coil",
        "type": "image"
      },
      {
        "src": "assets/projects/onpole-wearable-pcb/routing-top.png",
        "alt": "OnPole top-layer PCB routing and layout view",
        "type": "image"
      },
      {
        "src": "assets/projects/onpole-wearable-pcb/schematic.png",
        "alt": "OnPole Rev A complete schematic rendered from the supplied KiCad PDF",
        "type": "image"
      },
      {
        "src": "assets/projects/onpole-wearable-pcb/upwork-review.png",
        "alt": "Upwork 5.0 client review for the OnPole PCB project",
        "type": "image"
      }
    ],
    "detail": {
      "overview": "A 47 × 32 mm, 1.2 mm six-layer wearable platform developed through five client-approved milestones: electrical correction, footprint and library control, placement and routing, design review, and controlled manufacturing release. The board combines ESP32-S3 processing, GNSS, optical biometrics, IMU, precision analog capture, flash, Qi input, Li-ion charging, and service interfaces.",
      "role": "I owned the PCB work from schematic correction through release: component and footprint validation, placement, routing, power and RF review, mechanical Z-budget correction, fabricator audit responses, controlled variants, and handoff documentation. The gallery uses selected output-level views; controlled schematics, BOMs, Gerbers, and source files remain excluded.",
      "highlights": "Five design milestones completed and approved\n47 × 32 mm board at 1.2 mm thickness\nSix-layer stack with two continuous ground planes\nESP32-S3, GNSS, optical sensing, IMU, ADC, Qi and Li-ion power\nControlled GNSS routing and two assembly variants\nERC 0, zero unconnected pads, and release checksums",
      "challenges": "The work required honest correction of charger configuration, custom-library integrity, GNSS back-power risk, RF/mechanical constraints, and component availability before fabrication.",
      "results": "The final design content passed the fabricator audit and the boards entered production. The next evidence gate is physical bring-up; measured RF performance, sensor operation, power performance, and wearable validation are not yet claimed.",
      "technologies": "KiCad • ESP32-S3 • GNSS • Mixed-Signal PCB • Qi Power • DFM • Release Control",
      "milestones": "M1 — Architecture and electrical correction: reviewed requirements and corrected charger, power, sensor, and interface risks\nM2 — Library and component control: validated symbols, footprints, sourcing constraints, and mechanical budget\nM3 — Placement and routing: completed the compact six-layer layout with controlled power, ground, and GNSS strategy\nM4 — Design review: closed ERC, connectivity, mechanical, RF, and release-readiness findings\nM5 — Manufacturing release: issued controlled FULL_GNSS and GNSS_LATER variants, passed the fabricator content audit, and entered board production",
      "deliverables": "Complete one-page Rev A schematic shown in the gallery\nTop and bottom six-layer 3D PCB views\nTop-layer routing and layout evidence\nTwo variant-controlled fabrication releases with checksums\nAssembly, placement, release-review, and manufacturing documentation\n5.0 Upwork client review after the fabricator audit and production entry",
      "objective": "Turn a dense wearable electronics architecture into a compact, reviewable, and fabrication-ready six-layer PCB while controlling power, sensing, GNSS/RF, wireless charging, and mechanical constraints.",
      "decisions": "Used two continuous ground planes to protect return paths and mixed-signal integrity\nSeparated the release into FULL_GNSS and GNSS_LATER assembly variants\nCorrected charger configuration and GNSS back-power risks before fabrication\nControlled the GNSS path against the fabricator stackup instead of claiming unmeasured RF performance\nKept physical bring-up as a separate validation gate after production"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 48,
      "zoom": 1
    },
    "rating": "5.0",
    "reviewTitle": "PCB Layout & Routing from Finished KiCad Schematic (Wearable, GPS Antenna)",
    "reviewText": "Saif delivered a complete six-layer manufacturing release for a dense wearable PCB, on time and on budget, across five milestones. The client specifically praised the self-correction, clean verification, honest risk documentation, and successful fabricator audit.",
    "reviewDate": "Aug 9, 2026 - Aug 15, 2026",
    "featured": true,
    "hidden": false,
    "approvalPending": true,
    "status": "In Production - Bring-up Pending",
    "statusTone": "production",
    "categories": [
      "PCB Design",
      "Embedded Systems"
    ]
  },
  {
    "id": "neon-leon-security",
    "label": "Embedded Linux / Hardware Integration",
    "title": "Neon Leon Smart Security Prototype",
    "description": "Client-accepted Raspberry Pi bench prototype delivered through five integration milestones: motion, servo and eyes, camera, dashboard/audio/Telegram, then full-system validation.",
    "tags": [
      "Raspberry Pi",
      "Python",
      "systemd",
      "GPIO / I²C / I²S",
      "Bench Validation"
    ],
    "images": [
      {
        "src": "assets/projects/neon-leon-security/camera-module.jpg",
        "alt": "OV5647 camera module and ribbon connection used during hardware validation",
        "type": "image"
      },
      {
        "src": "assets/projects/neon-leon-security/pi-camera-connection.jpg",
        "alt": "Raspberry Pi Zero 2 W camera interface connection during bench validation",
        "type": "image"
      },
      {
        "src": "https://drive.google.com/file/d/1tP7JSPi-iqEwFnJfcXoxhK4ADYjJ3l_d/view?usp=drivesdk",
        "alt": "Client-accepted Neon Leon final bench demonstration",
        "type": "video"
      },
      {
        "src": "assets/projects/neon-leon-security/upwork-review.png",
        "alt": "Upwork 5.0 client review for the Neon Leon smart security project",
        "type": "image"
      }
    ],
    "detail": {
      "overview": "A Raspberry Pi Zero 2 W security bench prototype built and handed off across five milestones. M1 established the hardware baseline; M2 integrated three-direction PIR sensing, servo pan, and LED eyes; M3 added LAN-only camera live view; M4 added dashboard, I²S audio, and non-blocking Telegram alerts; M5 completed the full event sequence and regression test.",
      "role": "I integrated hardware and software across three cooperating Linux services, implemented the event pipeline and safe-output behavior, diagnosed camera and servo boundary failures, tested alert cooldown and audio backpressure, captured evidence, and prepared the final technical handoff.",
      "highlights": "Five milestone handoffs completed\nThree-direction PIR sensing and smooth servo pan\nOV5647 LAN-only camera service\nI²S audio, transistor-driven eye LEDs, dashboard, and Telegram alerts\nTen final tests passed\nThree services active with zero restarts at the final gate",
      "challenges": "Camera enumeration required a physical reconnection and retest. A low servo output-enable safety gate was corrected before motion was accepted. An audio-busy response was classified as expected backpressure rather than a false event failure, then verified in the complete sequence.",
      "results": "The real-hardware bench sequence was demonstrated and explicitly accepted by the client. This is a completed bench prototype—not a finished mechanical product. Enclosure work, visible-light hardware, calibrated current measurement, optical tuning, and environmental validation remain outside the completed scope.",
      "technologies": "Raspberry Pi Zero 2 W • Python • Linux • systemd • GPIO • I²C • I²S • HTTP APIs",
      "milestones": "M1 — Hardware baseline: verified Raspberry Pi, camera interface, PIR channels, PWM controller, audio path, and power assumptions\nM2 — Motion and outputs: integrated three-direction PIR sensing, smooth servo pan, and transistor-driven LED eyes\nM3 — Camera: established stable LAN-only live view and day/night operating modes\nM4 — Services and alerts: integrated dashboard, I²S audio, Telegram notification flow, and production service configuration\nM5 — Full integration: executed the complete event sequence, ten-test regression gate, evidence capture, and final client handoff",
      "deliverables": "Five milestone handoff packages and source snapshots\nAs-built wiring, power, and block documentation\nOperating instructions and mechanical-interface notes\nBench-test, current, temperature, and service-stability observations\nFinal recorded demonstration explicitly accepted by the client\n5.0 Upwork review for detail and fast communication",
      "objective": "Integrate motion sensing, camera, servo movement, visual and audio outputs, a phone dashboard, and Telegram alerts into a stable Raspberry Pi bench prototype with a clear handoff.",
      "decisions": "Split the system into three cooperating Linux services to isolate failures\nKept the camera LAN-only and avoided unnecessary cloud exposure\nUsed non-blocking Telegram notifications with cooldown handling\nAdded a servo output-enable safety gate before allowing movement\nClassified audio-busy responses as controlled backpressure and verified them in the complete sequence"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 34,
      "zoom": 1
    },
    "rating": "5.0",
    "reviewTitle": "Smart security device",
    "reviewText": "So great to work with and so detailed and quick communicator!!",
    "reviewDate": "Aug 10, 2026 - Aug 24, 2026",
    "featured": true,
    "hidden": false,
    "approvalPending": false,
    "status": "Client-Accepted Bench Prototype",
    "statusTone": "validated",
    "categories": [
      "Embedded Systems",
      "IoT"
    ]
  },
  {
    "id": "grtb001-telemetry",
    "label": "Mixed-Signal PCB / Data Acquisition",
    "title": "GRTB001 RC Telemetry & Data Logger",
    "description": "Four-layer Release 2 telemetry/data-logger design with a complete 66-file pre-fabrication, documentation, and factory-test package; physical PCBA validation remains pending.",
    "tags": [
      "ESP32-S3",
      "ADS131E04",
      "USB-C",
      "GNSS / RF",
      "4-Layer PCB"
    ],
    "images": [
      {
        "src": "assets/projects/grtb001-telemetry/top-view.png",
        "alt": "ESP32-S3 RC telemetry and mixed-signal PCB top 3D view",
        "type": "image"
      },
      {
        "src": "assets/projects/grtb001-telemetry/bottom-view.png",
        "alt": "ESP32-S3 RC telemetry and mixed-signal PCB bottom 3D and routing view",
        "type": "image"
      },
      {
        "src": "assets/projects/grtb001-telemetry/schematic.png",
        "alt": "GRTB001 complete mixed-signal telemetry schematic rendered from the supplied KiCad PDF",
        "type": "image"
      },
      {
        "src": "assets/projects/grtb001-telemetry/top-assembly.png",
        "alt": "GRTB001 top assembly drawing from the controlled release package",
        "type": "image"
      }
    ],
    "detail": {
      "overview": "A four-layer ESP32-S3 telemetry and data-logger PCB for RC vehicle and boat measurements. Release 2 combines three simultaneous load-cell channels through ADS131E04 acquisition, GNSS/PPS, IMU sensing, MicroSD logging, USB-C service, protected 4S power, and expansion interfaces.",
      "role": "I delivered the design through controlled pre-fabrication milestones: electrical baseline, placement and routing, ERC/DRC and parity verification, manufacturing outputs, procurement controls, annotated assembly views, documentation, and factory-test preparation. The gallery shows selected output-level views; source, BOM/CPL, and Gerber files remain private.",
      "highlights": "Manufacturing Release 2 and 66-file handoff package\nApproximately 89.75 × 77.10 mm, four layers\nThree simultaneous low-level load-cell channels\nZero-via native USB pair and GNSS RF path\nERC, DRC, parity, and unconnected items at zero\n185 matched BOM/CPL references plus factory-test preparation",
      "challenges": "I restarted routing after freezing the electrical baseline, corrected genuine ERC and pad-net issues, quantified ADC input-range limitations, documented MicroSD power-loss boundaries, and issued a controlled USB release revision instead of hiding unresolved risks.",
      "results": "The client accepted the pre-fabrication design, documentation, manufacturing, and factory-test package. No fabricated-PCBA, calibration, electrical, GNSS, USB, logging, or vehicle measurements are claimed until physical hardware is available.",
      "technologies": "KiCad • ESP32-S3 • ADS131E04 • USB-C • GNSS • Load Cells • Mixed-Signal PCB • DFM",
      "milestones": "M1 — Electrical and architectural baseline: froze interfaces, acquisition path, protected power, GNSS/PPS, IMU, storage, USB-C, and expansion requirements\nM2 — Manufacturing Release 2: completed four-layer layout, restarted routing where needed, closed ERC/DRC/parity findings, and issued the corrected USB release\nM3 — Documentation and factory test: completed assembly views, fabrication notes, procurement controls, bring-up planning, and the factory-test package",
      "deliverables": "Complete one-page mixed-signal telemetry schematic shown in the gallery\nTop and bottom Release 2 PCB views\nAnnotated top assembly drawing\n66-file controlled pre-fabrication handoff\n185-reference BOM/CPL parity package delivered privately\nRelease verification, fabrication notes, and factory-test preparation",
      "objective": "Create a manufacturable multi-sensor telemetry and data-logging board for RC vehicle and boat measurements with precision analog acquisition, protected vehicle power, GNSS/PPS, storage, USB-C, and expansion.",
      "decisions": "Restarted routing after freezing the electrical baseline instead of patching a weak layout\nUsed a zero-via native USB pair and a zero-via GNSS RF path\nSelected low-leakage protection for the load-cell inputs\nDocumented ADC input-range and MicroSD power-loss limitations explicitly\nIssued a controlled Release 2 revision for the corrected USB implementation"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 48,
      "zoom": 1
    },
    "rating": "",
    "reviewTitle": "",
    "reviewText": "",
    "reviewDate": "",
    "featured": true,
    "hidden": false,
    "approvalPending": true,
    "status": "Pre-Fabrication Release",
    "statusTone": "prefab",
    "categories": [
      "PCB Design",
      "Embedded Systems"
    ]
  },
  {
    "id": "suspension",
    "label": "Automotive / CAD",
    "title": "Formula Student Suspension System",
    "description": "Complete mechanical design and simulation of a Formula Student car suspension system, focusing on vehicle dynamics and structural integrity.",
    "tags": [
      "Autodesk Inventor",
      "MATLAB / Simulink",
      "Vehicle Dynamics"
    ],
    "images": [
      {
        "src": "assets/projects/suspension/01.jpg",
        "alt": "suspension_williams_2013",
        "type": "image"
      },
      {
        "src": "assets/projects/suspension/02.jpg",
        "alt": "Full CAD",
        "type": "image"
      },
      {
        "src": "assets/projects/suspension/03.jpg",
        "alt": "Quarter Car CAD",
        "type": "image"
      },
      {
        "src": "assets/projects/suspension/04.jpg",
        "alt": "Simulink Model (Quarter Car Model)",
        "type": "image"
      },
      {
        "src": "assets/projects/suspension/05.jpg",
        "alt": "Graph Scope for damping coeffcient",
        "type": "image"
      },
      {
        "src": "assets/projects/suspension/06.jpg",
        "alt": "Optimum Kinematics View",
        "type": "image"
      },
      {
        "src": "assets/projects/suspension/07.jpg",
        "alt": "Suspension System Analysis at Heave 30mm",
        "type": "image"
      },
      {
        "src": "assets/projects/suspension/08.jpg",
        "alt": "Suspension System Analysis at Heave 30mm 1",
        "type": "image"
      }
    ],
    "detail": {
      "overview": "A complete suspension system designed for a Formula Student race car, focusing on vehicle dynamics, suspension geometry optimization, and structural performance.",
      "objective": "Develop a Formula Student suspension concept that balances packaging, geometry, structural constraints, and predictable vehicle response.",
      "role": "I designed the suspension geometry and created the full CAD assembly using Autodesk Inventor. I also analyzed suspension kinematics and developed a quarter-car dynamic simulation model in MATLAB/Simulink.",
      "highlights": "Double wishbone suspension design\nSuspension geometry optimization\nCamber, caster, and toe analysis\nVehicle dynamics simulation\nQuarter-car Simulink model\nLoad transfer and ride analysis\nCAD assembly and packaging",
      "milestones": "Double wishbone suspension design\nSuspension geometry optimization\nCamber, caster, and toe analysis\nVehicle dynamics simulation\nQuarter-car Simulink model\nLoad transfer and ride analysis\nCAD assembly and packaging",
      "decisions": "Used a double-wishbone architecture\nIterated camber, caster, toe, and travel behavior\nCombined full CAD packaging with quarter-car dynamic simulation\nUsed kinematic analysis to evaluate heave and wheel-alignment behavior",
      "deliverables": "Project implementation and supporting technical evidence are shown in the gallery.",
      "challenges": "One of the biggest challenges was balancing suspension stiffness and dynamic response while maintaining realistic Formula Student constraints. Multiple iterations were tested using simulation tools to optimize suspension travel and wheel alignment behavior.",
      "results": "The final design achieved stable suspension kinematics and realistic dynamic behavior suitable for Formula Student applications.",
      "technologies": "Autodesk Inventor • MATLAB • Simulink • OptimumKinematics • Vehicle Dynamics • Mechanical Design"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 50,
      "zoom": 1
    },
    "rating": "",
    "reviewTitle": "",
    "reviewText": "",
    "reviewDate": "",
    "featured": false,
    "hidden": false,
    "approvalPending": false,
    "status": "Design & Simulation Complete",
    "statusTone": "neutral",
    "categories": [
      "Mechanical Design"
    ]
  },
  {
    "id": "bldc",
    "label": "Power Electronics",
    "title": "BLDC Motor Controller (ESC)",
    "description": "Developed an open-loop 6-step commutation driver for a 3-phase BLDC motor utilizing MOSFET inverter stages and PWM speed control.",
    "tags": [
      "Arduino UNO",
      "Power Electronics",
      "C++"
    ],
    "images": [
      {
        "src": "assets/projects/bldc/01.jpg",
        "alt": "Project 1",
        "type": "image"
      },
      {
        "src": "assets/projects/bldc/02.jpg",
        "alt": "Project",
        "type": "image"
      },
      {
        "src": "assets/projects/bldc/03.jpg",
        "alt": "Simulink",
        "type": "image"
      },
      {
        "src": "assets/projects/bldc/04.jpg",
        "alt": "Scope",
        "type": "image"
      },
      {
        "src": "assets/projects/bldc/05.jpg",
        "alt": "Schematic",
        "type": "image"
      },
      {
        "src": "https://drive.google.com/open?id=1ngK3TaYmEFiBJkjeQnWKy0TZACf53UuO&usp=drive_fs",
        "alt": "Project Video 6",
        "type": "video"
      }
    ],
    "detail": {
      "overview": "An electronic speed controller for brushless DC motors was designed and tested. The system uses 6-step commutation with hall-effect sensor feedback or sensorless back-EMF detection for precise motor control.",
      "role": "I designed the power stage using discrete MOSFETs, wrote the Arduino firmware for commutation logic and PWM generation, and tested the system across various load conditions.",
      "highlights": "3-Phase MOSFET inverter design\nIR2110 high/low-side gate driving\nPWM speed control using Arduino UNO\nOpen-loop 6-step commutation\nBack-EMF and Hall-sensor compatible architecture\nVoltage and current measurement integration\nHardware debugging and switching optimization",
      "challenges": "One of the main challenges was achieving stable high-side switching using bootstrap circuitry and eliminating unstable commutation behavior caused by timing issues and MOSFET switching noise. Multiple hardware iterations and oscilloscope-based debugging were performed to optimize performance.",
      "results": "The controller successfully operated a 3-phase BLDC motor with stable commutation and adjustable speed control under different loading conditions.",
      "technologies": "Arduino UNO • Power Electronics • IR2110 • MOSFET Drivers • PWM • C++ • Oscilloscope Debugging",
      "milestones": "3-Phase MOSFET inverter design\nIR2110 high/low-side gate driving\nPWM speed control using Arduino UNO\nOpen-loop 6-step commutation\nBack-EMF and Hall-sensor compatible architecture\nVoltage and current measurement integration\nHardware debugging and switching optimization",
      "deliverables": "Working implementation\nProject photos and technical evidence\nDesign, simulation, or competition validation shown in the gallery",
      "objective": "Build and test a discrete three-phase BLDC controller with six-step commutation and adjustable PWM speed control.",
      "decisions": "Used an IR2110-based high/low-side gate-drive architecture\nImplemented open-loop six-step commutation first to isolate switching behavior\nUsed oscilloscope-led timing and noise debugging before adding complexity"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 50,
      "zoom": 1
    },
    "rating": "",
    "reviewTitle": "",
    "reviewText": "",
    "reviewDate": "",
    "featured": false,
    "hidden": false,
    "approvalPending": false,
    "status": "Bench Prototype Complete",
    "statusTone": "complete",
    "categories": [
      "Embedded Systems",
      "Power Electronics"
    ]
  },
  {
    "id": "hand-gesture-rc",
    "label": "Robotics",
    "title": "Hand Gesture Control Car",
    "description": "Developed a wireless hand gesture-controlled robotic car using custom PCB design, embedded systems, and real-time motion-based navigation.",
    "tags": [
      "Arduino UNO",
      "PCB Design",
      "Embedded Systems"
    ],
    "images": [
      {
        "src": "assets/projects/hand-gesture-rc/01.jpg",
        "alt": "1743961204646 (1)",
        "type": "image"
      },
      {
        "src": "assets/projects/hand-gesture-rc/02.jpg",
        "alt": "Car 1",
        "type": "image"
      },
      {
        "src": "assets/projects/hand-gesture-rc/03.jpg",
        "alt": "PCB 1",
        "type": "image"
      },
      {
        "src": "assets/projects/hand-gesture-rc/04.jpg",
        "alt": "PCB 2",
        "type": "image"
      },
      {
        "src": "assets/projects/hand-gesture-rc/05.jpg",
        "alt": "PCB 3",
        "type": "image"
      },
      {
        "src": "assets/projects/hand-gesture-rc/06.jpg",
        "alt": "PCB",
        "type": "image"
      },
      {
        "src": "https://drive.google.com/open?id=1-dadFymKeD62kwnSnRUXCa-0tyz-Z_tt&usp=drive_fs",
        "alt": "Project Video",
        "type": "video"
      }
    ],
    "detail": {
      "overview": "A wireless hand gesture-controlled robotic car developed using embedded systems, motion sensing, and custom PCB design. The system detects hand movements through an accelerometer-based glove and translates them into real-time wireless commands for vehicle navigation.",
      "role": "I designed and developed both the transmitter and receiver systems, including the custom PCB for the gesture-control glove. I implemented the embedded firmware, wireless communication, gesture processing logic, and motor control system for real-time vehicle movement.",
      "highlights": "Hand gesture-based vehicle control\nCustom PCB design for wearable glove module\nAccelerometer sensor integration\nWireless RF/Bluetooth communication\nReal-time motion processing\nEmbedded motor control system\nDirectional command mapping\nLow-latency response handling\nPower regulation and signal routing",
      "challenges": "One of the biggest challenges was reducing noise and unstable readings from the motion sensor while maintaining responsive control. Multiple calibration and filtering techniques were implemented to improve gesture accuracy and communication stability. PCB routing and compact wearable integration were also optimized for reliable operation.",
      "results": "The robotic car successfully responded to hand gestures in real time with stable wireless communication and smooth directional control through the custom-designed wearable controller.",
      "technologies": "Arduino • Embedded Systems • PCB Design • Accelerometer Sensors • Wireless Communication • Motor Drivers • C++ • Hardware Prototyping",
      "milestones": "Hand gesture-based vehicle control\nCustom PCB design for wearable glove module\nAccelerometer sensor integration\nWireless RF/Bluetooth communication\nReal-time motion processing\nEmbedded motor control system\nDirectional command mapping\nLow-latency response handling\nPower regulation and signal routing",
      "deliverables": "Working implementation\nProject photos and technical evidence\nDesign, simulation, or competition validation shown in the gallery",
      "objective": "Translate wearable hand motion into reliable low-latency vehicle commands through a custom transmitter PCB and embedded receiver.",
      "decisions": "Separated wearable sensing from vehicle motor control\nApplied calibration and filtering to stabilize gesture recognition\nOptimized the custom glove PCB for compact wearable integration"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 50,
      "zoom": 1
    },
    "rating": "",
    "reviewTitle": "",
    "reviewText": "",
    "reviewDate": "",
    "featured": false,
    "hidden": false,
    "approvalPending": false,
    "status": "Working Prototype",
    "statusTone": "complete",
    "categories": [
      "Robotics",
      "Embedded Systems",
      "PCB Design"
    ]
  },
  {
    "id": "ctf-robot",
    "label": "Robotics",
    "title": "Auxilio CTF Robot",
    "description": "Developed an autonomous competition robot for Capture The Flag challenges featuring obstacle avoidance, sensor fusion, and real-time navigation under dynamic competition conditions.",
    "tags": [
      "ESP32",
      "Autonomous Robotics",
      "Sensor Fusion"
    ],
    "images": [
      {
        "src": "assets/projects/ctf-robot/01.jpg",
        "alt": "Robot",
        "type": "image"
      },
      {
        "src": "assets/projects/ctf-robot/02.jpg",
        "alt": "Comp",
        "type": "image"
      },
      {
        "src": "assets/projects/ctf-robot/03.jpg",
        "alt": "Robot in maze",
        "type": "image"
      },
      {
        "src": "assets/projects/ctf-robot/04.jpg",
        "alt": "Flag",
        "type": "image"
      },
      {
        "src": "assets/projects/ctf-robot/05.jpg",
        "alt": "Team",
        "type": "image"
      },
      {
        "src": "assets/projects/ctf-robot/06.jpg",
        "alt": "Prize",
        "type": "image"
      },
      {
        "src": "https://drive.google.com/open?id=160FFuD6hZGsMTHrk2Tj1dGeK4_R4V9nf&usp=drive_fs",
        "alt": "Competition Video",
        "type": "video"
      },
      {
        "src": "https://drive.google.com/open?id=1q6E4peKtgWZiOEpSG3EqRzhe38YigY9x&usp=drive_fs",
        "alt": "Video",
        "type": "video"
      }
    ],
    "detail": {
      "overview": "An autonomous robot developed for a Capture The Flag robotics competition. The robot was designed for navigation, obstacle avoidance, and target interaction in a dynamic competition environment.",
      "objective": "Build an autonomous robot able to navigate a competition maze, avoid obstacles, and complete capture-the-flag tasks under uncertain conditions.",
      "role": "I was responsible for the robot control system and software logic, including sensor integration, navigation behavior, and state machine development.",
      "highlights": "Autonomous navigation\nSensor fusion implementation\nState machine architecture\nESP32-based embedded control\nObstacle avoidance logic\nCompetition strategy implementation\nReal-time decision making",
      "milestones": "Autonomous navigation\nSensor fusion implementation\nState machine architecture\nESP32-based embedded control\nObstacle avoidance logic\nCompetition strategy implementation\nReal-time decision making",
      "decisions": "Used an explicit state-machine architecture\nCombined multiple sensors rather than trusting a single navigation input\nDesigned recovery behavior for unpredictable competition states",
      "deliverables": "Working implementation\nProject photos and technical evidence\nDesign, simulation, or competition validation shown in the gallery",
      "challenges": "The main challenge was ensuring reliable autonomous behavior under unpredictable competition conditions. Extensive testing and debugging were performed to improve navigation accuracy and system stability.",
      "results": "The robot successfully completed autonomous navigation tasks and contributed to achieving first place in the competition.",
      "technologies": "ESP32 • Embedded Systems • Robotics • Sensor Fusion • State Machines • C++"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 50,
      "zoom": 1
    },
    "rating": "",
    "reviewTitle": "",
    "reviewText": "",
    "reviewDate": "",
    "featured": true,
    "hidden": false,
    "approvalPending": false,
    "status": "1st Place Competition Robot",
    "statusTone": "success",
    "categories": [
      "Robotics",
      "Embedded Systems"
    ]
  },
  {
    "id": "robosoccer_robot",
    "label": "Robotics",
    "title": "RoboSoccer Robot",
    "description": "Developed an autonomous RoboSoccer robot capable of ball tracking, navigation, and real-time movement control in a dynamic football-like competition environment.",
    "tags": [
      "Arduino",
      "Robotics",
      "Autonomous Systems",
      "Sensor Integration"
    ],
    "images": [
      {
        "src": "assets/projects/robosoccer_robot/01.jpg",
        "alt": "Cover",
        "type": "image"
      },
      {
        "src": "assets/projects/robosoccer_robot/02.jpg",
        "alt": "Robot",
        "type": "image"
      },
      {
        "src": "assets/projects/robosoccer_robot/03.jpg",
        "alt": "Photo",
        "type": "image"
      }
    ],
    "detail": {
      "overview": "An autonomous robot developed for the RoboSoccer competition organized by the Faculty of Engineering - Helwan University. The robot was designed to detect, track, and interact with the ball while navigating dynamically during matches.",
      "role": "Worked on the control system implementation, sensor integration, and movement logic for navigation and ball interaction. Collaborated with teammates responsible for the mechanical structure and robot assembly.",
      "highlights": "Autonomous robot navigation\nSensor integration and calibration\nReal-time motor control\nBall tracking logic\nEmbedded control system\nDynamic movement handling\nCompetition robotics implementation",
      "challenges": "Achieving fast and stable response during ball tracking\nCalibrating movement for both speed and accuracy\nHandling dynamic interactions with opponent robots\nMaintaining reliable navigation during matches",
      "results": "Successfully developed a functional RoboSoccer robot capable of autonomous movement, ball interaction, and competitive match participation.",
      "technologies": "Arduino UNO • Embedded Systems • Robotics • Sensors • Motor Control • C++",
      "milestones": "Autonomous robot navigation\nSensor integration and calibration\nReal-time motor control\nBall tracking logic\nEmbedded control system\nDynamic movement handling\nCompetition robotics implementation",
      "deliverables": "Working implementation\nProject photos and technical evidence\nDesign, simulation, or competition validation shown in the gallery",
      "objective": "Create a responsive autonomous RoboSoccer platform for ball interaction and dynamic match navigation.",
      "decisions": "Balanced movement speed against tracking accuracy\nCalibrated sensors and motor behavior for changing match conditions\nSeparated mechanical responsibilities from control-system ownership within the team"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 50,
      "zoom": 1
    },
    "rating": "",
    "reviewTitle": "",
    "reviewText": "",
    "reviewDate": "",
    "featured": false,
    "hidden": false,
    "approvalPending": false,
    "status": "Competition Prototype",
    "statusTone": "complete",
    "categories": [
      "Robotics",
      "Embedded Systems"
    ]
  },
  {
    "id": "digital_clock_logic_circuit",
    "label": "Electronics / Digital Logic",
    "title": "Digital Clock Using Logic Gates",
    "description": "Designed and implemented a fully functional digital clock using discrete logic ICs, counters, and 7-segment displays without microcontrollers.",
    "tags": [
      "Digital Electronics",
      "Logic Gates",
      "74LS90",
      "7-Segment Displays"
    ],
    "images": [
      {
        "src": "assets/projects/digital_clock_logic_circuit/01.jpg",
        "alt": "Cover",
        "type": "image"
      },
      {
        "src": "assets/projects/digital_clock_logic_circuit/02.jpg",
        "alt": "Project 1",
        "type": "image"
      },
      {
        "src": "assets/projects/digital_clock_logic_circuit/03.jpg",
        "alt": "Project 2",
        "type": "image"
      },
      {
        "src": "assets/projects/digital_clock_logic_circuit/04.jpg",
        "alt": "Project 3",
        "type": "image"
      },
      {
        "src": "assets/projects/digital_clock_logic_circuit/05.jpg",
        "alt": "Proteus",
        "type": "image"
      }
    ],
    "detail": {
      "overview": "A digital clock system designed using classic digital electronics components and sequential logic circuits. The project utilized NE555 timer circuits, BCD counters, logic gates, and 7-segment displays to implement real-time hour, minute, and second counting functionality.",
      "role": "I designed the complete circuit architecture, implemented the hardware connections on breadboards, created and tested the Proteus simulation, and debugged timing and counter synchronization issues throughout the project.",
      "highlights": "NE555 timer pulse generation\n74LS90 decade counter implementation\n74LS47 BCD-to-7-segment decoding\nSequential logic circuit design\nCarry propagation handling\nCounter reset logic\nReal-time digital clock operation\nHardware debugging and testing\nProteus simulation and validation",
      "challenges": "Synchronizing carry signals between counters\nEliminating unstable counting behavior\nManaging reset conditions for time rollover\nDebugging complex wiring connections on hardware",
      "results": "Successfully developed a fully operational digital clock capable of accurate time counting and stable real-time display using discrete digital logic components.",
      "technologies": "Digital Electronics • Logic Gates • NE555  • Proteus • Breadboard Prototyping • Hardware Debugging",
      "milestones": "NE555 timer pulse generation\n74LS90 decade counter implementation\n74LS47 BCD-to-7-segment decoding\nSequential logic circuit design\nCarry propagation handling\nCounter reset logic\nReal-time digital clock operation\nHardware debugging and testing\nProteus simulation and validation",
      "deliverables": "Project implementation and supporting technical evidence are shown in the gallery.",
      "objective": "Implement stable hours, minutes, and seconds using discrete sequential logic without a microcontroller.",
      "decisions": "Used NE555 pulse generation with cascaded BCD counters\nImplemented explicit carry and rollover logic\nValidated the architecture in Proteus before hardware debugging"
    },
    "coverSettings": {
      "focusX": 50,
      "focusY": 50,
      "zoom": 1
    },
    "rating": "",
    "reviewTitle": "",
    "reviewText": "",
    "reviewDate": "",
    "featured": false,
    "hidden": false,
    "approvalPending": false,
    "status": "Hardware Complete",
    "statusTone": "complete",
    "categories": [
      "Digital Electronics"
    ]
  }
];
