export interface IBoard
{
    id?: string | null;
    title: string;
    description?: string | null;
    icon?: string | null;
    lastActivity?: string | null;
    lista?: IList[];
    labels?: ILabel[];
    members?: IMember[];
}

export interface IList
{
    id: string; 
    position?: number;
    descripcion: string;
    cards?: ICard[];
}

export interface ICard
{
    id?: string | null;
    boardId?: string | null;
    listId?: string;
    position?: number;
    title?: string;
    description?: string | null;
    labels?: ILabel[];
    dueDate?: string | null;
}

export interface IMember
{
    id:       string;
    email:    string;
    fullName: string;
    isActive: boolean;
    roles:    string[];
    avatar:   string | null;
}
 


export interface ILabel
{
    id: string | null;
    boardId: string;
    title: string;
}
