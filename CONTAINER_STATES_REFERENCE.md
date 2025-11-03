# Container States Reference with Corrections

## Overview
The 3D container visualization has four distinct states, each with specific visual behaviors and elements.

---

## State 1: Building

**Purpose**: Visualizes the container build process with active choreography

### Elements & Behaviors:

#### Container Box
- **Walls**: 0% opacity (all transparent, wireframe aesthetic)
- **Wireframe**: Dotted lines, 8px long with 8px gap, gray
- **Animation**: Does not rotate - camera rotates to the front 45 degrees angle to make sure the image entering the container is visible
- **Glow**: No pulsing blue glow effect outside container

#### Doors
- **State**: Open start at 45 degrees, opens out (90° rotation hinge, 45 degrees to container front)
- **Position**: make reflect intended effect
- **Hinges**: Visible on left and right 

#### Image Crate
- **Visible**: Yes
- **Animation Sequence**:
  1. **Entering** (6 seconds): Flies in from off-screen left (-12, 8, 8) with dramatic arc to front of container (0, 2.5, 6)
  2. **Docking** (4 seconds): Enters through open doors, moves from z:6 to z:2 (just inside container) with bounce effect
  3. **Settled**: Rests at (0, 2.0, 2) inside container
  4. **Floating**: Subtle hover animation inside container after choreography completes
- **Color**: Docker blue (#0db7ed) with white whale logo
- **Scale**: this image should be 50% of the total interior space so it looks like the container is relatively full 
- **Label**: "Loading image: daynic name" floats above crate

#### Wireframe Transition
- **Trigger**: When crate settles (docked)
- **Behavior**: Dotted wireframe animates to fill 8px gaps, walls transition to 100% opacity
- **Concurrent**: Doors transition to 100% opacity begin closing animation

#### Text Label
- **Content**: "Building container..."
- **Position**: Above container at (0, 7, 0)
- **Style**: Frosted glass card with blue border

#### Idle Animation (Post-Choreography)
- **Trigger**: After doors close and wireframe solidifies
- **Container**: no animation no rotation 
- **Wireframe**: filled, non see through anything
- **Crate**: Continues floating inside

---

## State 2: Ready
Not sure this is state two why not have it be state one? Or we don't need it?
---

## State 3: Running

**Purpose**: Container is actively running

### Elements & Behaviors:

#### Container Box
- **Walls**: 100% opacity 
- **Wireframe**: Solid lines, success green (`#4CAF50`)
- **Animation**: None (static)
- **Rotation**: 0° (front-facing)

#### Doors
- **State**: Closed (0° rotation)
- **Locking Bars**: Visible

#### Image Crate
- **Visible**: No

#### Text Label
- **Visible**: No

#### Overall Appearance
- Active, healthy state
- Green color indicates successful execution
- Stable and locked

---

## State 4: Error

**Purpose**: Container encountered an error

### Elements & Behaviors:

#### Container Box
- **Walls**: 100% opacity (opaque)
- **Wireframe**: Solid lines, alert red (`#F44336`)
- **Animation**: doors open outwards to 45 degree angle - same as starting positon
- **Rotation**: 0° (front-facing)

#### Doors
- **State**: Open (45° rotation)
- **Locking Bars**: Visible

#### Image Crate
- **Visible**: Yes

#### Text Label
- **Visible**: No

#### Overall Appearance
- Error state
- Red color indicates failure
- Stable structure but problematic state

---

