/**
 * @overview Browser script
 */
import regedit from "regedit";

export default (tara) => {
  tara.getPlugin("tara-right-click-menu")
    .then((contextMenu) => {
      const menu = contextMenu.createMenu();
      regedit.list("HKCR\\Directory\\shell", (err, keys) => {
        if (err) {
          throw err;
        }
        console.log(keys);
        for (let key of keys["HKCR\\Directory\\shell"].keys) {
          regedit.list(`HKCR\\Directory\\shell\\${key}`, (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results);
            menu.menu.append(new menu.Item({
              label: results[`HKCR\\Directory\\shell\\${key}`].values[""].value, click() { console.log(results[`HKCR\\Directory\\shell\\${key}`].values[""].value); }
            }));
          });
        }
      });
      menu.applyIf((event) => true);
      menu.listen();
    });
};
