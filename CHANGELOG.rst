==========
Changelog
==========

+++++++++
v0.17.0 (09/10/2025)
+++++++++

**Added**

- Display grid box name and location when populating cassette positions

+++++++++
v0.16.0 (05/09/2025)
+++++++++

**Added**

- Add front page

+++++++++
v0.15.5 (27/08/2025)
+++++++++

**Fixed**

- Display grid information in cassette 

+++++++++
v0.15.4 (01/08/2025)
+++++++++

**Changed**

- Rename mentions of sample instances to grids

+++++++++
v0.15.3 (10/07/2025)
+++++++++

**Changed**

- Lock out edits for pre session information 24h before session

+++++++++
v0.15.2 (08/07/2025)
+++++++++

**Changed**

- Improve button disabling logic in sample collection overview
- Update tracking label instructions

**Fixed**

- Display error message if sample colleciton does not exist in submission page

+++++++++
v0.15.1 (30/06/2025)
+++++++++

**Changed**

- Update heading names
- Display session number in shipment overview

+++++++++
v0.15.0 (24/06/2025)
+++++++++

**Added**

- Sample information is now displayed in sample selection dialogue for grid box slots

+++++++++
v0.14.0 (13/06/2025)
+++++++++

**Added**

- Display dewar history
- Display asterisk for required fields

**Fixed**

- Fixed shipments not being updated

+++++++++
v0.13.1 (02/06/2025)
+++++++++

**Fixed**

- Docker image now uses UID for user
- Links to API resources now use a frontend-friendly link

+++++++++
v0.13.0 (08/05/2025)
+++++++++

**Added**

- Include warning for international shipments before shipping

+++++++++
v0.12.0 (25/04/2025)
+++++++++

**Added**

- Display ancestors/descendants of samples

+++++++++
v0.11.0 (17/04/2025)
+++++++++

**Added**

- Highlight grid boxes stored at eBIC

+++++++++
v0.10.2 (11/04/2025)
+++++++++

**Removed**

- Remove "no unassigned items" requirement

**Changed**

- Include additional tracking label instructions

+++++++++
v0.10.1 (07/03/2025)
+++++++++

**Removed**

- Removed "Save and edit" option in import samples page
- Removed "You can still edit your samples after you submitted" warning

**Fixed**

- Fixed typo in shipments link in "submitted"

+++++++++
v0.10.0 (28/02/2025)
+++++++++

**Added**

- Users can now automatically generate dewar code
- Users can add multiple items at once to containers without slots 

+++++++++
v0.9.0 (28/01/2025)
+++++++++

**Added**

- Add button for generating PDF reports of sample collection

**Changed**

- Replace measurement units
- Improve wording on help texts

+++++++++
v0.8.0 (10/01/2025)
+++++++++

**Added**

- Demark positions in storage dewars

**Fixed**

- Storage dewar title is now correctly displayed
- Prevent creating dewars in dewars
- Fix test typing errors

**Changed**

- Ignore samples in internal containers in inventory

+++++++++
v0.7.0 (10/12/2024)
+++++++++

**Added**

- Option to choose between skipping to pre-session or adding sample collection containers in sample import page
- Separate form for storage dewars

**Changed**

- Renamed "shipment" to "sample collection"
- Renamed application to Scaup

+++++++++
v0.6.3 (27/11/2024)
+++++++++

**Changed**

- Enabled caching for most server-side endpoints

+++++++++
v0.6.2 (18/11/2024)
+++++++++

**Added**

- Remove button now displays loading indicator when clicked
- Global 404 page

**Fixed**

- Canes can no longer have other canes as children
- Page title always gets updated on item creation in inventory items

+++++++++
v0.6.1 (05/11/2024)
+++++++++

**Fixed**

- Make footer readable
- Display detailed errors on failed item creation

+++++++++
v0.6.0 (22/10/2024)
+++++++++

**Added**

- Walk-ins now support optional dewar codes
- Editable dropdown for fields which take generic options
- Labels/shipment information page

**Changed**

- Grid box field names now better reflect reality
- CRUD operations are now performed server side for better performance
- Conflicting items are not resolved in the frontend anymore

**Fixed**

- Update URL with type of created object if type is not the default
- Conflicting cassette items can no longer overlap

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
