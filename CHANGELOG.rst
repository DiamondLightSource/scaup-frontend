==========
Changelog
==========

+++++++++
v0.6.0 (22/10/2024)
+++++++++

**Added**

- Walk-ins now support optional dewar codes
- Editable dropdown for fields which take generic options

**Changed**

- Grid box field names now better reflect reality
- CRUD operations are now performed server side for better performance

**Fixed**

- Update URL with type of created object if type is not the default

+++++++++
v0.5.0 (23/09/2024)
+++++++++

**Added**

- "View data" button if sample is linked to a collection
- Cassette view (assign samples to cassette slots)

**Changed**

- Disabled dewar code field in inventory items


+++++++++
v0.4.0 (28/08/2024)
+++++++++

**Added**

- Inventory system
- More grid box types
- More puck types
- User can now import samples from other shipments in proposal

**Removed**

- :code:`FIB followed by Kryos` option in gridbox page

**Changed**

- Clean up front page

+++++++++
v0.3.0 (09/06/2024)
+++++++++

**Added**

- Users can now be redirected to SynchWeb to perform shipment requests
- Top level containers now accept "walk-in" type
- Name field is disabled if barcode is present for containers

**Changed**

- Paths that precede a session (`/proposals/{x}/sessions` for example) now redirect to PATo
- Shipments now belong to specific sessions, rather than proposals

**Fixed**

- Prevent crash on invalid name for samples
- Shipments list on session page is now updated correctly

+++++++++
v0.2.0 (06/06/2024)
+++++++++

**Added**

- Imaging conditions form

**Removed**

- Sample step no longer asks if grids are clipped

+++++++++
v0.1.0 (22/04/2024)
+++++++++

**Added**

- Extra detail to error messages
- Filter for invalid names
- Item types are now displayed next to item in tree
- Sample macromolecules now have their safety level displayed next to their names
- Shipments are now session specific

**Fixed**

- Unassigned item now updates properly once saved
- Edit button is no longer available if shipment has been booked
- Samples table now redirects to correct sample
- Selected item in URL is now highlighted correctly on page load
- "Create new item" now works as expected if autosaving item

+++++++++
v0.0.1 (27/03/2024)
+++++++++

**Added**

- User can now make multiple copies of sample when adding them 

**Fixed**

- Active item name is now included in form
