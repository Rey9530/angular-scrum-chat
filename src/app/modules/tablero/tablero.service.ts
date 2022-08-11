import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError, debounceTime } from 'rxjs';
import { Board, Card, Label, List } from './tablero.models';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ScrumboardService
{
    // Private
    private _board: BehaviorSubject<Board | null>;
    private _boards: BehaviorSubject<Board[] | null>;
    private _card: BehaviorSubject<Card | null>;
    private url = environment.base_url;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _snackBar: MatSnackBar
    )
    {
        // Set the private defaults
        this._board = new BehaviorSubject(null);
        this._boards = new BehaviorSubject(null);
        this._card = new BehaviorSubject(null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for board
     */
    get board$(): Observable<Board>
    {
        return this._board.asObservable();
    }

    /**
     * Getter for boards
     */
    get boards$(): Observable<Board[]>
    {
        return this._boards.asObservable();
    }

    /**
     * Getter for card
     */
    get card$(): Observable<Card>
    {
        return this._card.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get boards
     */
    getBoards(): Observable<Board[]>
    {
        return this._httpClient.get<Board[]>(`${this.url}tableros`).pipe(
            map(response => { 
                return response.map(item => new Board(item))
            }),
            tap(boards => this._boards.next(boards))
        );
    }

    /**
     * Get board
     *
     * @param id
     */
    getBoard(id: string): Observable<Board>
    {
        return this._httpClient.get<Board>(`${this.url}tableros/${id}`,).pipe(
            map(response => {
                response.lista.map((e)=>{
                    return e.cards.map(el=>{
                        el.position= Number(el.position)
                        return el
                    })
                }); 
                return new Board(response)
            }),
            tap(board => this._board.next(board))
        );
    }

    /**
     * Create board
     *
     * @param board
     */
    createBoard(board: {title:string,description:string,icon:string}): Observable<Board>
    {
        return this.boards$.pipe(
            take(1),
            switchMap(boards => this._httpClient.post<Board>(`${this.url}tableros`, board).pipe(
                map((newBoard) => { 
                    // Update the boards with the new board
                    this._boards.next([...boards, newBoard]);

                    // Return new board from observable
                    return newBoard;
                })
            ))
        );
    }

    /**
     * Update the board
     *
     * @param id
     * @param board
     */
    updateBoard(id: string, board: Board): Observable<Board>
    {
        return this.boards$.pipe(
            take(1),
            switchMap(boards => this._httpClient.patch<Board>('api/apps/scrumboard/board', {
                id,
                board
            }).pipe(
                map((updatedBoard) => {

                    // Find the index of the updated board
                    const index = boards.findIndex(item => item.id === id);

                    // Update the board
                    boards[index] = updatedBoard;

                    // Update the boards
                    this._boards.next(boards);

                    // Return the updated board
                    return updatedBoard;
                })
            ))
        );
    }

    /**
     * Delete the board
     *
     * @param id
     */
    deleteBoard(id: string): Observable<boolean>
    {
        return this.boards$.pipe(
            take(1),
            switchMap(boards => this._httpClient.delete('api/apps/scrumboard/board', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted board
                    const index = boards.findIndex(item => item.id === id);

                    // Delete the board
                    boards.splice(index, 1);

                    // Update the boards
                    this._boards.next(boards);

                    // Update the board
                    this._board.next(null);

                    // Update the card
                    this._card.next(null);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Create list
     *
     * @param list
     */
    createList(list: List): Observable<List>
    {  
        return this._httpClient.post<List>(`${this.url}tableros/listas/${this._board.value.id}`, {descripcion:list.descripcion, position:list.position}).pipe(
            //TODO: DESCOMENTAR
            // map(response => new List(response)),
            tap((newList:List) => {
                //TODO: que venga de API
                newList.cards=[];
                this.openSnackBar(newList.descripcion+' fue creada con exito');
                // Get the board value
                const board = this._board.value;
                // Update the board lists with the new list
                board.lista = [...board.lista, newList];

                // Sort the board lists
                board.lista.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            })
        );
    }

    /**
     * Update the list
     *
     * @param list
     */
    updateList(list: List): Observable<List>
    { 
        return this._httpClient.put<List>(`${this.url}tableros/listas/${list.id}`, {descripcion:list.descripcion, position:Number(list.position)}).pipe(
            //TODO: DESCOMENTAR
            // map(response => new List(response)),
            tap((updatedList) => {
                this.openSnackBar('Actualizado con exito');
                updatedList.cards = [];
                // Get the board value
                const board = this._board.value;

                // Find the index of the updated list
                const index = board.lista.findIndex(item => item.id === list.id);

                // Update the list
                board.lista[index] = updatedList;

                // Sort the board lists
                board.lista.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            })
        );
    }

    /**
     * Update the lists
     *
     * @param lists
     */
    updateLists(lists: List[]): Observable<List[]>
    {
        return this._httpClient.patch<List[]>('api/apps/scrumboard/board/lists', {lists}).pipe(
            //TODO: DESCOMENTAR
            // map(response => response.map(item => new List(item))),
            tap((updatedLists) => {

                // Get the board value
                const board = this._board.value;

                // Go through the updated lists
                updatedLists.forEach((updatedList) => {

                    // Find the index of the updated list
                    const index = board.lista.findIndex(item => item.id === updatedList.id);

                    // Update the list
                    board.lista[index] = updatedList;
                });

                // Sort the board lists
                board.lista.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            })
        );
    }

    /**
     * Delete the list
     *
     * @param id
     */
    deleteList(id: string): Observable<boolean>
    {
        return this._httpClient.delete<any>(`${this.url}tableros/listas/${id}`).pipe(
            tap((isDeleted) => { 
                if(isDeleted.statusCode==200){
                    this.openSnackBar('Eliminado con exito');
                    // Get the board value
                    const board = this._board.value;
    
                    // Find the index of the deleted list
                    const index = board.lista.findIndex(item => item.id === id);
    
                    // Delete the list
                    board.lista.splice(index, 1);
    
                    // Sort the board lists
                    board.lista.sort((a, b) => a.position - b.position);
    
                    // Update the board
                    this._board.next(board);

                }
            })
        );
    }

    openSnackBar(msg:string) {
        this._snackBar.open(msg, 'X', {
            duration:2000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-primary'],
        });
      }

    /**
     * Get card
     */
    getCard(id: string):any // Observable<Card>
    {
        return this._board.pipe(
            take(1),
            map((board) => {

                // Find the card
                const card:any = board.lista.find(list => list.cards.some(item => item.id === id))
                                  .cards.find(item => item.id === id);

                // Update the card
                this._card.next(card);

                // Return the card
                return card;
            }),
            switchMap((card) => {

                if ( !card )
                {
                    return throwError('Could not found the card with id of ' + id + '!');
                }

                return of(card);
            })
        );
    }

    /**
     * Create card
     *
     * @param card
     */
    createCard(card: Card): Observable<Card>
    { 
        let data = {  title:card.title,position: card.position  }
        return this._httpClient.post<Card>(`${this.url}tableros/cards/${card.listId}`, data).pipe(
            map(response => new Card(response)),
            tap((newCard) => {
                
                newCard = Object.assign(card,newCard)
                // Get the board value
                const board = this._board.value;

                // Find the list and push the new card in it
                board.lista.forEach((listItem, index, list) => {
                    if ( listItem.id === newCard.listId )
                    {
                        list[index].cards.push(newCard);
                    }
                });

                // Update the board
                this._board.next(board);

                // Return the new card
                return newCard;
            })
        );
    }

    /**
     * Update the card
     *
     * @param id
     * @param card
     */
    updateCard(id: string, card: Card): Observable<Card>
    {
        delete card.id;
        delete card.labels;
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.put<any>(`${this.url}tableros/cards/${id}`, {
                ...card
            }).pipe(
                map((updatedCard) => { 
                    updatedCard.labels=[];
                    // Find the card and update it
                    board.lista.forEach((listItem) => {
                        listItem.cards.forEach((cardItem, index, array) => {
                            if ( cardItem.id === id )
                            {
                                array[index] = updatedCard;
                            }
                        });
                    });

                    // Update the board
                    this._board.next(board);

                    // Update the card
                    this._card.next(updatedCard);
                    
                    this.openSnackBar('Actualizado con exito con exito');
                    // Return the updated card
                    return updatedCard;
                })
            ))
        );
    }

    /**
     * Update the cards
     *
     * @param cards
     */
    updateCards(cards: Card[]): Observable<Card[]>
    {
        return this._httpClient.patch<Card[]>('api/apps/scrumboard/board/cards', {cards}).pipe(
            map(response => response.map(item => new Card(item))),
            tap((updatedCards) => {

                // Get the board value
                const board = this._board.value;

                // Go through the updated cards
                updatedCards.forEach((updatedCard) => {

                    // Find the index of the updated card's list
                    const listIndex = board.lista.findIndex(list => list.id === updatedCard.listId);

                    // Find the index of the updated card
                    const cardIndex = board.lista[listIndex].cards.findIndex(item => item.id === updatedCard.id);

                    // Update the card
                    board.lista[listIndex].cards[cardIndex] = updatedCard;

                    // Sort the cards
                    board.lista[listIndex].cards.sort((a, b) => a.position - b.position);
                });

                // Update the board
                this._board.next(board);
            })
        );
    }

    
    /**
     * Update the cards
     *
     * @param cards
     */
     moveCard(id_card:string,id_list:string): Observable<any>
     {
        const data = { 
            id_list,id_card
        }
         return this._httpClient.put(`${this.url}tableros/move_cards`,data).pipe(
            //  map(response => response.map(item => new Card(item))),
             tap((updatedCards) => {
 
                 // Get the board value
                 const board = this._board.value;
                 this.openSnackBar('Exito');
                 // Go through the updated cards
                /* updatedCards.forEach((updatedCard) => {
 
                     // Find the index of the updated card's list
                     const listIndex = board.lista.findIndex(list => list.id === updatedCard.listId);
 
                     // Find the index of the updated card
                     const cardIndex = board.lista[listIndex].cards.findIndex(item => item.id === updatedCard.id);
 
                     // Update the card
                     board.lista[listIndex].cards[cardIndex] = updatedCard;
 
                     // Sort the cards
                     board.lista[listIndex].cards.sort((a, b) => a.position - b.position);
                 });*/
 
                 // Update the board
                 this._board.next(board);
             })
         );
     }

    /**
     * Delete the card
     *
     * @param id
     */
    deleteCard(id: string): Observable<boolean>
    {
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.delete('api/apps/scrumboard/board/card', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the card and delete it
                    board.lista.forEach((listItem) => {
                        listItem.cards.forEach((cardItem, index, array) => {
                            if ( cardItem.id === id )
                            {
                                array.splice(index, 1);
                            }
                        });
                    });

                    // Update the board
                    this._board.next(board);

                    // Update the card
                    this._card.next(null);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Update card positions
     *
     * @param cards
     */
    updateCardPositions(cards: Card[]): void // Observable<Card[]>
    {
        /*return this._httpClient.patch<Card[]>('api/apps/scrumboard/board/card/positions', {cards}).pipe(
            map((response) => response.map((item) => new Card(item))),
            tap((updatedCards) => {

                // Get the board value
                const board = this._board.value;

                // Find the card and update it
                board.lista.forEach((listItem) => {
                    listItem.cards.forEach((cardItem, index, array) => {
                        if ( cardItem.id === id )
                        {
                            array[index] = updatedCard;
                        }
                    });
                });

                // Update the lists
                board.lista = updatedLists;

                // Sort the board lists
                board.lista.sort((a, b) => a.position - b.position);

                // Update the board
                this._board.next(board);
            })
        );*/
    }

    /**
     * Create label
     *
     * @param label
     */
    createLabel(label: Label): Observable<Label>
    {
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.post<Label>('api/apps/scrumboard/board/label', {label}).pipe(
                map((newLabel) => {

                    // Update the board labels with the new label
                    board.labels = [...board.labels, newLabel];

                    // Update the board
                    this._board.next(board);

                    // Return new label from observable
                    return newLabel;
                })
            ))
        );
    }

    /**
     * Update the label
     *
     * @param id
     * @param label
     */
    updateLabel(id: string, label: Label): Observable<Label>
    {
        console.log(label)
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.patch<Label>('api/apps/scrumboard/board/label', {
                id,
                label
            }).pipe(
                map((updatedLabel) => {

                    // Find the index of the updated label
                    const index = board.labels.findIndex(item => item.id === id);

                    // Update the label
                    board.labels[index] = updatedLabel;

                    // Update the board
                    this._board.next(board);

                    // Return the updated label
                    return updatedLabel;
                })
            ))
        );
    }

    /**
     * Delete the label
     *
     * @param id
     */
    deleteLabel(id: string): Observable<boolean>
    {
        return this.board$.pipe(
            take(1),
            switchMap(board => this._httpClient.delete('api/apps/scrumboard/board/label', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted label
                    const index = board.labels.findIndex(item => item.id === id);

                    // Delete the label
                    board.labels.splice(index, 1);

                    // If the label is deleted...
                    if ( isDeleted )
                    {
                        // Remove the label from any card that uses it
                        board.lista.forEach((list) => {
                            list.cards.forEach((card) => {
                                const labelIndex = card.labels.findIndex(label => label.id === id);
                                if ( labelIndex > -1 )
                                {
                                    card.labels.splice(labelIndex, 1);
                                }
                            });
                        });
                    }

                    // Update the board
                    this._board.next(board);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Search within board cards
     *
     * @param query
     */
    search(query: string): Observable<Card[] | null>
    {
        // @TODO: Update the board cards based on the search results
        return this._httpClient.get<Card[] | null>('api/apps/scrumboard/board/search', {params: {query}});
    }
}
