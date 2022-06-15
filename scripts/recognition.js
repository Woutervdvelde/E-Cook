const image = document.getElementById("recipe");

const recognize = async () => {
    const worker = Tesseract.createWorker({logger: m => console.log(m)});
    await worker.load();
    await worker.loadLanguage('nld');
    await worker.initialize('nld');

    const { data: { text } } = await worker.recognize(image.src);
    console.log(text);
}





// ORIGINAL TEXT OF IMAGE 3
// Snijd de kipfilet in blokjes. Snipper de uien en de knoflook. Verhit de olie in
// een pan en bak de kipfiletblokjes rondom bruin. Bak de ui en de knoflook
// nog 5 min. mee. Bestrooi met de kerrie en laat het kort meebakken. Schep
// er de bloem door en voeg al roerend de bouillon toe. Laat het geheel op
// laag vuur 10 min. stoven. Schil de appels en snijd ze in blokjes. Laat de
// appel nog zo'n 5 min. meestoven met de rest. Breng alles op smaak met
// zout en peper. Verwarm de oven voor op 220°C. (hetelucht) Laat de
// bladerdeeg vellen naast elkaar ontdooien. Leg 6 vellen op elkaar en rol ze
// uit op een met bloem bestoven werkvlak tot een ronde lap met een
// doorsnee van ca. 32 cm. Bekleed daarmee de vorm en prik de bodem een
// aantal keren in met een vork, zodat er gaatjes ontstaan in het deeg en hij
// straks goed gaar wordt. Vul de deegbodem met het kip-kerrie mengsel. Rol
// de resterende deeglapjes uit tot een deksel met een doorsnee van ca. 26
// cm. Leg het deegdeksel op de taart en druk de randen op elkaar. Snijd er in
// het midden een rondje uit. Zet in het uitgestoken rondje een opgerold
// reepje aluminiumfolie zodat de stoom eruit kan ontsnappen als hij in de
// oven staat. (zie foto)Roer de eidooier los met 1 eetl. water en bestrijk het
// deegdeksel met het ei. Zet de taart in de voorverwarmde oven en bak de
// taart in ca. 25 min. gaar en goudbruin. Eet smakelijk!