# Protein electron-transfer case study

## Coordinates

- Deposited structure: [PDB 2PCC](https://doi.org/10.2210/pdb2PCC/pdb).
- Downloaded unchanged from https://files.rcsb.org/download/2PCC.pdb on 2026-10-12.
- X-ray structure, 2.30 Å resolution, Saccharomyces cerevisiae.
- Display: chain A (cytochrome c peroxidase) and chain B (iso-1-cytochrome c).
- Omitted: chains C/D (the second crystal copy) and water. Protein atom positions are not altered.
- Highlighted: heme B104, heme A296, Trp A191; interface views also show Gly A192, Ala A193 and Ala A194.
- The displayed envelopes are calculated van der Waals surfaces of protein atoms, not experimental electron-density maps.

The 26.4 Å iron-to-iron annotation is calculated from the deposited coordinates:

- HEM B104 FE: (14.768, 15.394, 29.346) Å
- HEM A296 FE: (-1.679, 33.021, 18.640) Å
- Euclidean separation: 26.3786537564 Å, rounded to one decimal.

This is not a donor-to-Trp distance or a tunneling path length. No line or moving particle is used to imply a measured electron trajectory. Ribbon smoothing is a molecular-graphics representation of the deposited fold.

## Interpretation and primary sources

1. Pelletier H, Kraut J. (1992). Crystal structure of a complex between electron transfer partners, cytochrome c peroxidase and cytochrome c. Science 258:1748–1755. https://doi.org/10.1126/science.1334573 — structural geometry and proposed pathway region.
2. Payne TM, Yee EF, Dzikovski B, Crane BR. (2016). Constraints on the radical cation center of cytochrome c peroxidase for electron transfer from cytochrome c. Biochemistry 55:4807–4822. https://doi.org/10.1021/acs.biochem.6b00262 — introduction, equations 1–4, and substitution experiments. https://pmc.ncbi.nlm.nih.gov/articles/PMC5689384/
3. Marcus RA. (1956). On the Theory of Oxidation-Reduction Reactions Involving Electron Transfer. I. J. Chem. Phys. 24:966–978. https://doi.org/10.1063/1.1742723 — reorganization theory. https://authors.library.caltech.edu/records/desqy-fmq55
4. Beratan DN, Betts JN, Onuchic JN. (1991). Protein electron transfer rates set by the bridging secondary and tertiary structure. Science 252:1285–1288. https://doi.org/10.1126/science.1656523 — coupling through protein structure. https://authors.library.caltech.edu/records/zg638-1m391

The before/after controls explain the first incoming electron in the native catalytic reaction (source 2, equation 2). These redox labels are a mechanistic overlay on fixed coordinates, not crystallographically resolved reaction states. In particular, no ferryl oxygen has been added to 2PCC. The highlighted bridge is a literature-proposed structural region, not a quantum-chemical calculation or populated sequence of intermediates. No rates, molecular dynamics, orbital surfaces or probabilities are simulated.

## Classical and quantum mechanism comparison

The linked four-step sequence shows reactants, environmental reorganization, a successful electron-transfer event and product relaxation. The nuclear/solvent diagram and localized-charge-state diagram are complementary views of the same weak-coupling Marcus teaching model, not two competing biological mechanisms. Sources 3 and 4 provide the theory; source 2 supplies the case-specific redox chemistry.

The diagrams use dimensionless q and arbitrary energy units: G_R(q) = q², G_P(q) = (q − 1)² − 0.2. Thus λ = 1, ΔG = −0.2, the crossing is q = 0.4 and its free energy is 0.16. These values are editorial teaching choices, not measurements or fitted parameters for 2PCC. The four selected configurations are (q=0, R), (q=0.4, R), (q=0.4, P), (q=1, P). The two middle steps deliberately share the same nuclear coordinate.

The quantum diagram shows the two diabatic free energies at the selected q, with the occupied charge-state assignment highlighted. Its dashed connector denotes electronic coupling; it is not an electron trajectory. It omits coupling-induced splitting and does not evolve a wavefunction, compute a rate or show nuclear quantum effects. A curve crossing alone does not guarantee transfer. Playback shows one successful event and has no physical timescale. 2PCC atoms remain fixed. The mechanism steps and molecular-view redox controls stay synchronized.

## Rendering

The molecular viewer also supports synchronized classical, quantum and combined explanatory layers. Its four-step controls share state and playback with the energy diagrams. Switching layers preserves the camera, and donor/bridge/acceptor buttons focus the measured sites.

Classical reorganization is represented by six blue-to-amber dipole glyphs placed schematically around the donor iron and Trp191 ring centroid. The positions, lengths and rotations are editorial illustrations, not explicit solvent coordinates, calculated fields or simulated atomic motion. Their orientation changes with the same illustrative q used in the diagrams. Preparation and transfer have identical q = 0.4; the transfer step snaps to that orientation without animating nuclear reorganization. Reduced-motion users see the stage endpoints without rotation animation.

The quantum layer emphasizes actual bridge atoms and bonds (A194–A193–G192), the donor heme and the Trp191 acceptor. The bridge is proposed from the literature; it is not a calculated dominant pathway or sequence of real, occupied intermediates. Transparent redox-site halos are annotations, not orbitals. A straight arrow, offset from the atomic sites after transfer, denotes only the net donor-to-acceptor redox change. It is not an electron trajectory. These limits are stated in the visible caption and expandable visual key. All overlays can be hidden independently of the coordinates, and no atomic positions are changed.

3Dmol.js 2.5.5, locally vendored from the official npm `3dmol` package. BSD-3-Clause license is in `../vendor/3Dmol-LICENSE.txt`. Viewer code and coordinates load only when this case study is visited. The interface works in both Dunobo themes and has a linked coordinate/structure fallback when WebGL is unavailable.

Coordinate file SHA-256: `d9c19f316054d86cbf84900fe36b67fb55e1c793377c64b099786c42248bff0e`.

# DHFR hydride-transfer case

- Original coordinates: https://files.rcsb.org/download/1RX2.pdb, downloaded 2026-10-12 unchanged.
- E. coli DHFR, chain A, 1.80 Å X-ray structure; retain NAP A164 and FOL A161. Display omits water, manganese and beta-mercaptoethanol. RCSB notes alternative re-refinement 3QL3.
- Crystal contains oxidized NADP+ and folate, a nonreactive Michaelis-complex mimic. It does not contain the reactive NADPH/DHF pair or product THF.
- C4N of NAP A164: (31.149,45.947,14.124) Å. C6 of FOL A161: (31.895,44.651,11.140) Å. Distance 3.34 Å rounded; carbon separation is not tunneling barrier width.
- No deposited atom coordinates are changed. Schematic H localization sites are 1.09 Å along the carbon-carbon axis from either end. Midpoint is illustrative, not a calculated saddle point. Opacity does not encode probabilities. Compare shows alternative accounts, not several actual hydrogens.
- Energy inset is schematic, with no physical energy or time scale. The hydride step assumes N5-protonated DHF; separate proton delivery is outside this sequence. Ligand bond orders and identities remain those of the crystal mimic.
- Sawaya & Kraut (1997), https://doi.org/10.1021/bi962337c: deposited structure.
- Sikorski et al. (2004), https://doi.org/10.1021/ja031683w: isotope and temperature evidence supporting tunneling in WT ecDHFR.
- Wang et al. (2006), https://doi.org/10.1073/pnas.0606976103: distal mutations and environmentally coupled tunneling interpretation, not direct observation of a nuclear trajectory.
- Wan et al. (2014), https://doi.org/10.1073/pnas.1415856111: pseudo-Michaelis-complex interpretation and protonation context.
