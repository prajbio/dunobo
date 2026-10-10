/* Editorial questions; scientific claims remain in the linked evidence records. */
(function () {
  const extra = [
    {id:'walking',title:'Learning to walk, in many ways',description:'Read bodies and footprints to investigate how early relatives moved.',stops:[['ardi','A body for trees and the ground'],['laetoli','A walk preserved in ash'],['lucy','What can a skeleton tell us?'],['dmanisi','Relatives beyond Africa']]},
    {id:'fire',title:'Stones, sparks and imagination',description:'Investigate tools, traces of burning and marks made with care.',stops:[['lomekwi','A tool without a known maker'],['wonderwerk','Traces of burning in a cave'],['gesher','Repeated clues to controlled fire'],['blombos','Patterns whose meaning is lost'],['sulawesi','Art on a cave wall']]},
    {id:'molecules',title:'The tiny clues inside us',description:'Discover how DNA and proteins reveal relationships that bones alone cannot.',stops:[['xiahe','When proteins preserve a clue'],['denny','Two parents, two human groups'],['chagyrskaya','A community in its DNA'],['oase','An ancestor only generations away'],['wallacea','An island with a complex past']]}
  ];
  for (const s of extra) { s.stops = s.stops.map(([event,title]) => ({event,title})); window.STORYLINES.push(s); }
  const themes = {
    overview:['How do we piece together our shared past?','Human evolution is a branching history. Different kinds of evidence answer different questions; many details remain open.'],
    tools:['What can a stone tool tell us about its maker?','A tool records an action. Identifying its maker, purpose and place in a wider history needs additional evidence.'],
    africa:['Can our origins be pinned to one place?','Fossils from different parts of Africa help us explore a history of connected populations, with uneven preservation and coverage.'],
    neanderthals:['What can we learn about Neanderthal lives?','Individual remains reveal glimpses of bodies, relationships and communities. They do not stand for every Neanderthal.'],
    denisovans:['How do we find a group known from so few remains?','Genetics, proteins and fossils can connect discoveries across Asia. The map still has enormous gaps.'],
    islands:['What happens when we look beyond the mainland?','Island discoveries reveal diverse relatives and complex population histories. A sea crossing is not a precisely known route.'],
    iceage:['Who lived in Europe during the Ice Age?','Ancient genomes reveal both relationships and changes through time. A few sampled individuals cannot describe an entire continent.'],
    farming:['Did people, practices or both move?','The spread of farming can involve local continuity, incoming people and later mixing. Similar objects alone cannot settle the question.'],
    layers:['How do scientists separate visits to the same place?','An excavation can contain many occupations. Keep its layers, assemblages and dates separate when comparing sites.'],
    americas:['How early were people in the Americas?','Footprints, artifacts and ancient DNA contribute different clues. No single discovery establishes every route or the first arrival.'],
    walking:['What clues show how our relatives moved?','Walking evolved in a branching family. A footprint and a skeleton offer different windows into movement.'],
    fire:['How do we recognize traces of ancient behavior?','Tools, burning and art reveal actions. Purpose, language and meaning are often harder to recover.'],
    molecules:['What survives when a life is long gone?','DNA and proteins preserve some biological relationships. They do not record a person’s language, identity or entire journey.']
  };
  const questions = {
    sahel:'Where might our earliest relatives fit?',ardi:'Could climbing and upright walking go together?',laetoli:'Can a short walk leave a very long record?',lucy:'How much of a life can bones reveal?',
    lomekwi:'Who shaped these stones?',nyayanga:'Do teeth beside tools identify the toolmaker?',dmanisi:'Who lived beyond Africa before our species?',
    irhoud:'Is the oldest known fossil a birthplace?',omo:'How can volcanic ash help date a person?',herto:'Why compare fossils from different places?',
    xiahe:'What if ancient DNA has not survived?',harbin:'Can molecules help place a remarkable skull?',penghu:'What do we do when a fossil has alternative dates?',
    denny:'Can a tiny bone reveal two parents?',oase:'How recently did these ancestors live?',chagyrskaya:'Can DNA reveal relatives in a community?',kebara:'Can anatomy tell us how someone spoke?',elsidron:'What can shared maternal DNA tell us?',
    wonderwerk:'Did burning leave a trace inside this cave?',gesher:'What would repeated use of fire leave behind?',schoningen:'What survives when tools were made of wood?',
    blombos:'We can see the marks—but what did they mean?',sulawesi:'How can a mineral crust help date a painting?',
    flores:'Could another human branch live on an island?',callao:'How do a few fossils change the family picture?',madjedbebe:'What evidence marks an arrival across the sea?',wallacea:'Does an island have only one population story?',lapita:'Can pots and DNA tell different parts of a story?',
    bacho:'What do early genomes reveal about ancestry?',sungir:'What can one burial—and one genome—show?',bichon:'What can one person tell us about an Ice Age population?',
    anatolia:'Did farming always arrive with new people?',steppe:'How do genomes reveal a large population change?',
    white:'How old are these footsteps?',cooper:'How do layers help test an early date?',monte:'What does a distant site add to the picture?',anzick:'How do we connect archaeology and genetic ancestry?',usr:'What can one ancient genome add?'
  };
  for (const story of window.STORYLINES) {
    const theme = themes[story.id]; story.question = theme[0]; story.takeaway = theme[1];
    story.stops.forEach((stop,i) => {
      stop.question = questions[stop.event] || (stop.event.startsWith('road-') ? 'How many occupations are recorded at this site?' : 'What do the dated individuals at this site reveal?');
      stop.transition = i < story.stops.length-1 ? 'Next, investigate '+story.stops[i+1].title+'. Compare what kind of evidence survives there.' : story.takeaway;
    });
  }
})();

