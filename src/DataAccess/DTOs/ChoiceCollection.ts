import ChoiceData from "./ChoiceData";

export enum ChoiceStatus {
  Unmodified,
  Edited,
  Deleted,
  Added
}

interface Choice {
  data: ChoiceData;
  status: ChoiceStatus;
}

class ChoiceCollection {
  private _choices: Choice[];

  constructor(choices: Choice[]) {
    this._choices = choices;
  }

  static fromChoiceData(choices: ChoiceData[]) {
    return new ChoiceCollection(
      choices.map(data => this.choiceFromChoiceData(data))
    );
  }

  add = (data: ChoiceData) => {
    data.choiceId = `Added_${this._choices.length}`;
    this._choices = [
      ...this._choices,
      ChoiceCollection.choiceFromChoiceData(data, ChoiceStatus.Added)
    ];

    return new ChoiceCollection(this._choices);
  };

  delete = (choiceId: string) => {
    this._choices = this._choices.map(c => {
      if (c.data.choiceId == choiceId) {
        c.status = ChoiceStatus.Deleted;
      }
      return c;
    });

    return new ChoiceCollection(this._choices);
  };

  update = (data: ChoiceData) => {
    this._choices = this._choices.map(c => {
      if (c.data.choiceId == data.choiceId) {
        c.data = data;
        c.status =
          c.status == ChoiceStatus.Unmodified ? ChoiceStatus.Edited : c.status;
      }
      return c;
    });

    return new ChoiceCollection(this._choices);
  };

  getChoices = (): Choice[] => {
    return this._choices;
  };

  getChoiceData = (choiceId: string): ChoiceData => {
    const choice = this._choices.find(c => c.data.choiceId == choiceId);
    if (choice === undefined) {
      throw Error("ChoiceId not found");
    }

    return choice.data;
  };

  getByStatus = (status: ChoiceStatus): ChoiceData[] => {
    return this._choices.filter(c => c.status == status).map(c => c.data);
  };

  getUndeleted = (): ChoiceData[] => {
    return this._choices
      .filter(c => c.status != ChoiceStatus.Deleted)
      .map(c => c.data);
  };

  onCollectionSaved = () => {
    this._choices = this._choices
      .filter(c => c.status != ChoiceStatus.Deleted)
      .map(c => {
        c.status = ChoiceStatus.Unmodified;
        return c;
      });

    return new ChoiceCollection(this._choices);
  };

  private static choiceFromChoiceData(
    data: ChoiceData,
    status: ChoiceStatus = ChoiceStatus.Unmodified
  ): Choice {
    return {
      data,
      status
    } as Choice;
  }
}

export default ChoiceCollection;
