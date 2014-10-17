/**
 * Created by Vodalok on 2014/10/15.
 */

var User = function(opts)
{
    this.OwnMapCoord = opts.OwnMapCoord;
    this.GPower = opts.GPower;
    this.LMana = opts.LMana;
    this.Food = opts.Food;
    this.GPowerGenRate = opts.GPowerGenRate;
    this.GPowerGenLevel = opts.GPowerGenLevel;
    this.LManaGenRate = opts.LManaGenRate;
    this.LManaGenLevel = opts.LManaGenLevel;
    this.FoodGenRate = opts.FoodGenRate;
    this.FoodGenLevel = opts.FoodGenLevel;
    this.BarrackLevel = opts.BarrackLevel;
};

module.exports = User;