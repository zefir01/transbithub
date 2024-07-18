using System;
using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class Base<T> where T : Enum
    {
        private Dictionary<Langs, Dictionary<T, string>> data;
        private IMenu menu;
        private Langs Lang => menu.Lang;

        public Base(IMenu menu)
        {
            this.menu = menu;
            data = Init();
        }

        protected virtual Dictionary<Langs, Dictionary<T, string>> Init()
        {
            return null;
        }

        public string Get(T key)
        {
            return data[Lang][key];
        }

        public string Get(T key, params string[] args)
        {
            // ReSharper disable once CoVariantArrayConversion
            return String.Format(data[Lang][key], args);
        }
    }
}