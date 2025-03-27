# Progressbar Resource for FiveM/QB-Core

## Overview
This is a customizable progressbar resource for FiveM, specifically designed for QB-Core framework. It provides a flexible way to create progress indicators with various customization options.

## Features
- Smooth animated progress bar
- Pixel-based progress visualization
- Customizable labels and duration
- Optional cancellation
- Supports animations and prop attachments
- Responsive design

## Installation
1. Download the resource
2. Place in your `resources` folder
3. Add `ensure progressbar` to your `server.cfg`

## Usage Examples

### Basic Progress
```lua
QBCore.Functions.Progressbar("action_name", "Action Description", 5000, false, true, {
    disableMovement = false,
    disableCombat = true
}, {
    animDict = "animation_dictionary",
    anim = "animation_name"
}, {}, {}, function()
    -- On Complete
end, function()
    -- On Cancel
end)
```

### Advanced Usage with Prop
```lua
QBCore.Functions.Progressbar("attach_item", "Attaching Item", 10000, false, true, {
    disableMovement = true,
    disableCombat = true
}, {
    animDict = "pickup_object",
    anim = "pickup_low"
}, {
    model = "prop_tool_screwdvr",
    bone = 28422,
    coords = vector3(0.1, 0.0, 0.0),
    rotation = vector3(0.0, 0.0, 0.0)
}, {}, function()
    -- Completed successfully
end)
```


## Dependencies
- QB-Core Framework
- FiveM

## Screenshots
![Progressbar Screenshot 1](https://github.com/user-attachments/assets/16716e97-c313-4e95-be90-9ac505dc6c8a)
![Progressbar Screenshot 2](https://github.com/user-attachments/assets/cfc77f4b-ec97-4d17-8c66-a6ed93c79c70)

## Performance Considerations
- Uses requestAnimationFrame for smooth animations
- Lightweight implementation
- Minimal resource overhead

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.

