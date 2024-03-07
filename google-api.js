const dotenv = require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

class GoogleSpreadsheetAPI {
    constructor(){
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const SHEET_ID = process.env.SPREADSHEETID;
        const SCOPE = ['https://www.googleapis.com/auth/spreadsheets',
                       'https://www.googleapis.com/auth/drive',
                       'https://www.googleapis.com/auth/drive.file'
                    ];    
        const serviceAccountAuth = new JWT({
            email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: GOOGLE_API_KEY,
            scopes: SCOPE,
        });
        this.isInformationLoaded = false;
        this.doc = new GoogleSpreadsheet( SHEET_ID, serviceAccountAuth );
        console.log('[GoogleSheets] initial setup done..');
    }

    getDocumentInfo = async () => {
        try{
            if( this.isInformationLoaded == true && this.doc.title != undefined) return;
            await this.doc.loadInfo();
            console.log('[GoogleSheets] ..fetched document info.')
            this.isInformationLoaded = true;
        } catch(error){
            console.log('[GoogleSheets] ERROR ON LOADING INFORMATION:', error);
            this.isInformationLoaded = false;
        }
    }

    createNewSpreadsheet = async () => {
        try{
            const spreadsheet = await GoogleSpreadsheet.createNewSpreadsheetDocument(serviceAccountAuth, { title: 'new spreadsheet' });
            console.log( '[GoogleSheets] new spreadsheet:', spreadsheet.spreadsheetId );
            await spreadsheet.loadInfo();
            console.log( '[GoogleSheets] new spreadsheet:', spreadsheet);
            
            return spreadsheet;
        } catch(error) {
            console.error('[GoogleSheets] ERROR ON CREATING SPREADSHEET', error);
        }
    };

    getPermissions = async () => {
        return await this.doc.listPermissions();
    };

    sharePermission = async (emailAddress) => {
        await doc.share( emailAddress );
        console.log(`[GoogleSheets] sent share invitation to: ${emailAddress}`);
    }

    getInfoAboutCell = async () => {
        try{
            const sheet = this.doc.sheetsByIndex[0];
            console.log('[GoogleSheets]', 'sheet.title:', sheet.title);
            await sheet.loadCells('A1:E10');
            console.log('[GoogleSheets]', 'sheet.cellStats:', sheet.cellStats);
        } catch (error) {
            console.log('[GoogleSheets] ERROR ON GETTING CELL INFO', error);
        }
    }

    addRow = async (sheetTitle, dataObject) => {
        try{
            const sheet = this.doc.sheetsByTitle[sheetTitle];
            
            if( sheet == undefined) throw 'INVALID SHEET TITLE';
            
            console.log(`[GoogleSheets] found sheetTitle: ${sheetTitle}..`);
            const row = await sheet.addRow({ name: dataObject.name, value: dataObject.value, date: dataObject.date });
            console.log(`[GoogleSheets] ..append info to sheet: ${sheetTitle} => ${dataObject}`);
            return;
        } catch(error) {
            console.error('[GoogleSheets] ERROR ON ADD ROW:', error);
        }
    }
}

module.exports = GoogleSpreadsheetAPI;