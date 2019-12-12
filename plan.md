~~Milestone 1~~ - React / Redux State / Rooms:
* Rooms can be created
* State model sorted
* Update model sorted

~~Milestone 2~~ - Basic Properties:
* Restyle
* Properties panel can change object colours

~~Milestone 3~~ - Doors / Openings
* Openings can be on walls of existing rooms

~~Milestone 4 - Selection~~
* Picking works
* Map Properties can be changed / fleshed out 

~~Milestone 5 - Save and Load~~
* Map can be saved and loaded

~~Milestone 6 - Props~~
* Basic props can be placed on the map

~~Milestone 7 - Labels~~
* Objects on the map are labelled

~~Milestone 8 - Zoom Levels~~
* Map can be zoomed in or out 

~~Milestone 9 - Object Translation / Deletion~~
* Translate / Delete Rooms
    * Points
* Translate / Delete Props
* Delete
* Visual Representation for select

MVP Polish - 
* ~~Improved doorways / openings~~
    * ~~Can select walls separately from rooms~~
        * ~~Introduce wall segments~~
        * ~~Make segments selectable~~
        * ~~Properties panel with split option~~
        * ~~Can hide walls~~
        * ~~Fix property panel issues with type~~  
    * ~~Attach Doors to walls~~
        * ~~Doors position stored as a 0 to 1 value against a wall + width~~
        * ~~Doors move with room/wall~~ 
* Refactor reducer / duplicate maths logic
* Improved props
* Key bindings
* Text and number components only update onBlur
* ~~Drag UX~~
* ~~Improve room / hallway creation~~

Todo for Milestone N - (Effort - S / M / L)
* High Priority (MVP)
    * [M] Improve Doorways / Openings
* Medium Priority
    * [L] Textured lines / surfaces
    * [S] Undo / Redo
    * [S] Clean up duplicate code in reducers and actions
    * [M] Multi/Drag select
* Low Priority
    * [M] Maps can have multiple layers/floors
    * [L] 3d Preview
    * [L] Real time collaboration
    * [M] Random Generation
    
Notes 
* Consider porting to WebGL when implementing textures

UX Test Scott
* ~~Select + Drag in same action expected~~
* ~~Zoom broken~~
* ~~Dragging points often missed~~
* ~~Expected drag to draw a box~~

UX Test Jamie
* ~~Bug with double clicking rooms~~
* Door snapping to grid
* Click to place room point + need to complete loop not obvious
* Desired Features 
    * Add description field for DMing
    * Key bindings++
    * Textures