﻿using GalleryFound.Models.Services;
using System.Windows.Input;

namespace GalleryFound;

public partial class MainPage : ContentPage
{
	public ICommand ButtonCommand { get; }

	public MainPage()
	{
		InitializeComponent();

		// メイン画面描画後、各種値のロード
		Loaded += async (s, e) => await StaticValuesService.AllLoadAsync();

		ButtonCommand = new Command<Type>(x =>
		{
            if (x is null)
            {
                return;
            }

            var page = (Page)Activator.CreateInstance(x);
            Shell.Current.Navigation.PushAsync(page);
		});

		BindingContext = this;
	}
}
