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

## Continuous animation and literature audit — 2026-10-12

Both models now use a requestAnimationFrame clock (14 editorial seconds per cycle) with pause, speed, optional looping and a scrubber. No atom coordinates are altered. Playback stops when the document, mechanism or viewer leaves view. Explicit playback is opt-in; there is no automatic motion on load. Loop restart resets reactants and is not a reverse reaction.

DHFR: classical gold H moves on the idealized straight C4–C6 coordinate; violet fixed-site cues fade. The energy inset tracks an illustrative barrier and fixed quantum endpoint markers. Fades are not wavefunctions, populations or coherent oscillations. No quantitative tunneling fraction or isotope effect is calculated. Electronically quantum QM/MM potentials alone do not constitute nuclear quantum dynamics.

ET: environment q moves continuously from 0 to .4, remains .4 across the selected electronic transition, then relaxes to 1. Redox labels switch at the crossing; annotation halos cross-fade, not an electron in flight. The same q drives the Marcus plot and polarization glyphs. The two accounts are complementary, not mutually exclusive mechanisms. Selected successful-event playback does not assert every energy-matching encounter transfers an electron.

Recent primary sources checked:
- 2024, CHARMM-GUI QM/MM Interfacer, https://doi.org/10.1021/acs.jctc.4c00439 — DHFR with protonated substrate, separate environmental/chemical modeling.
- 2025, Machine Learning QM/MM Potentials: Evaluating Transferability in DHFR-Catalyzed Reactions, https://doi.org/10.1021/acs.jctc.4c01487 — donor-H minus acceptor-H coordinate, reactive ligands, umbrella sampling. Not a measured tunneling movie.
- 2025, Fast rational enzyme design by computational non-equilibrium alchemical transformations, https://doi.org/10.1039/D5CC03075G — adaptive string free-energy paths. No trajectory imported into this site.
- 2026, Quantum Enhanced Modeling of Enzyme Inhibition and Drug Behavior Integrating Tunneling Kinetics and Molecular Dynamics, https://www.scitepress.org/PublishedPapers/2026/142893/ — conference proof of concept with simplified tunneling proxies, not validation of this atomistic animation.
- 2022, Crystal structure of Trypanosoma cruzi heme peroxidase and characterization of its substrate specificity and compound I intermediate, https://doi.org/10.1016/j.jbc.2022.102204 — comparative discussion of yeast CcP Trp191 and its proposed transfer region; not a new yeast time-resolved trajectory.
- 2025, Reactivity of canonical bacterial cytochrome c peroxidases, https://doi.org/10.1039/D4SC07339H — bacterial diheme family, explicitly not substituted for yeast CcP chemistry.

Search scope included 2024–2026 DHFR hydride/nuclear quantum dynamics and yeast Cc/CcP transfer. This targeted check was not exhaustive; publication dates were distinguished from web crawl dates. Direct older experimental sources remain the reaction evidence. No newer experimentally resolved trajectory of this exact yeast pair was identified.


## Remaining mechanism families — 12 October 2026

All coordinate files below were downloaded unchanged from `https://files.rcsb.org/download/ID.pdb`. The viewer selects the specified chains, omits waters and retains deposited coordinates. Gold halos are explanatory attention markers, never measured charge densities. Stage timing and diagram amplitudes are qualitative, not fits or trajectories. See `../mechanism-cases.json` for site selections, structural limitations and primary literature per chapter.

- **6W4X**: E. coli RNR · trapped engineered complex. Chains B, C. Cryo-EM 3.60 Å. The trapping construct uses E52Q and fluorotyrosine122 in β. This is a structural relay reference, not a native turnover movie.
- **1TEZ**: Photolyase–DNA · repaired-lesion reference. Chains A, I, J. X-ray 1.80 Å. The synthetic CPD-like lesion was split by X-rays. These coordinates show a repaired, flipped-out substate, not an intact CPD or a live repair trajectory.
- **1U19**: Bovine rhodopsin · dark-state retinal. Chains A. X-ray 2.20 Å. Fixed 11-cis-retinal geometry. The adjacent torsion diagram illustrates isomerization; the crystal coordinates are not morphed into a calculated product.
- **3WU2**: Photosystem II · D1/D2 structural context. Chains A, D. Only chains A/D and their cofactors are displayed. Pigment identities are from the deposited structure. Highlighting the pigments does not select a unique early charge-separation pathway.
- **3ENI**: FMO · eight bacteriochlorophyll sites. Chains A. One FMO chain is shown. BCL residue numbers are PDB identifiers, not a prescribed energy-transfer order. Halos show explanatory emphasis, not simulated populations or measured coherence.
- **1EMA**: GFP · chromophore and proton-relay residues. Chains A. Fixed GFP structure. CRO66, Ser205 and Glu222 are highlighted; the intervening water is omitted. The schematic relay does not turn a cluster calculation into a whole-protein trajectory.
- **2D1S**: Firefly luciferase · intermediate analogue. Chains A. Thermostable Japanese firefly luciferase bound to a high-energy intermediate analogue (SLU). The crystal ligand is not emitting oxyluciferin; chemiexcitation is illustrated separately.
- **1BNA**: B-DNA dodecamer · structural context. Chains A, B. Canonical DNA duplex, without repair proteins or a measured rare tautomer. It is not the experimental DNA monolayer used in spin-filtering measurements.
- **1MAG**: Gramicidin A · membrane-channel reference. Chains A, B. Solid-state NMR channel structure. No water chain or moving proton is resolved here. The adjacent wire is idealized; proton hopping does not mean one nucleus traverses the entire wire.
- **1K4C**: KcsA · one crystallographic protomer. Chains C. One KcsA protomer and crystal K⁺ sites, with Fab omitted. The full tetramer is not reconstructed. Site occupancy in a crystal is not a direct movie of permeation.
- **6PU0**: Pigeon CRY4 · structural homologue. Chains A. Pigeon protein, not the European robin CRY4 tested in the cited magnetic-sensitivity experiment. Only FAD is marked; no experimentally identified spin pair is inferred from this structure.
- **4GU5**: Drosophila cryptochrome · dark-state reference. Chains A. Updated 2.30 Å structure. FAD binding is structural evidence; it does not establish a magnetic behavioural response or a specific ROS radical-pair partner.
- **8F76**: Human OR51E2 · propionate-bound receptor. Chains A. Receptor chain A with propionate (PPI401); signalling partners omitted. An active binding pocket is not evidence of a donor–acceptor electron-tunneling route.
- **1JFF**: α/β tubulin · taxol-stabilized sheet structure. Chains A, B. A tubulin dimer from zinc-induced sheets, not a complete microtubule or neuron. Tryptophan positions are measured; collective-state lifetimes and consciousness claims are not encoded in them.
- **2V1A**: AsLOV2 · parent scaffold for MagLOV. Chains A. Parent LOV2 fold with FMN, not the engineered MagLOV2 variant. The 2026 sensing study uses this scaffold as structural context. No native qubit or Earth-field compass is implied.
