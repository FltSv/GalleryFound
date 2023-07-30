using System.Windows.Input;

namespace GalleryFound;

public partial class MainPage : ContentPage
{
	public ICommand ButtonCommand { get; }

	public MainPage()
	{
		InitializeComponent();

        //figmaMainPage.Drawable = new Draw();

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

    class Draw : IDrawable
    {
        void IDrawable.Draw(ICanvas canvas, RectF dirtyRect)
        {
            // View:     frameView
            // NodeName: Android Large - 1
            // NodeType: FRAME
            // NodeId:   2:3
            //canvas.SaveState();
            //canvas.FillColor = Color.FromRgb(255, 255, 255);
            //canvas.Alpha = 1;
            //canvas.FillRoundedRectangle(0f, 0f, 360f, 800f, 0f);
            //canvas.RestoreState();


            // View:     imageView
            // NodeName: Vector 1
            // NodeType: VECTOR
            // NodeId:   4:3

            // View:     elipseView
            // NodeName: Ellipse 1
            // NodeType: ELLIPSE
            // NodeId:   3:6
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(255, 0, 0);
            canvas.Alpha = 1;
            canvas.FillEllipse(47f, 363f, 73f, 75f);
            canvas.RestoreState();


            // View:     elipseView1
            // NodeName: Ellipse 3
            // NodeType: ELLIPSE
            // NodeId:   3:11
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(173, 0, 255);
            canvas.Alpha = 1;
            canvas.FillEllipse(144f, 267f, 73f, 75f);
            canvas.RestoreState();


            // View:     elipseView2
            // NodeName: Ellipse 4
            // NodeType: ELLIPSE
            // NodeId:   3:12
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(0, 41, 255);
            canvas.Alpha = 1;
            canvas.FillEllipse(241f, 363f, 73f, 75f);
            canvas.RestoreState();


            // View:     elipseView3
            // NodeName: Ellipse 5
            // NodeType: ELLIPSE
            // NodeId:   3:13
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(3, 215, 24);
            canvas.Alpha = 1;
            canvas.FillEllipse(144f, 459f, 73f, 75f);
            canvas.RestoreState();


            // View:     frameView1
            // NodeName: fountain-pen 1
            // NodeType: FRAME
            // NodeId:   3:8
            canvas.SaveState();
            canvas.RestoreState();


            // View:     imageView1
            // NodeName: Vector
            // NodeType: VECTOR
            // NodeId:   3:9
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(255, 255, 255);
            canvas.Alpha = 1;
            canvas.Translate(67.166664f, 384.0202f);
            var vector0Builder = new PathBuilder();
            var vector0path = vector0Builder.BuildPath("M7.8375 20.619L14.5508 11.6573L27.9933 0.463125C28.6108 -0.154375 29.64 -0.154375 30.2258 0.463125L31.35 1.58729C31.9675 2.17313 31.9675 3.20229 31.35 3.81979L20.1558 17.2623L11.1942 23.9756L7.8375 20.619ZM10.07 25.0998L6.71333 21.7431L2.2325 23.9756L0 30.689L3.35667 27.3323C3.67333 27.0631 4.16417 27.0631 4.48083 27.3323C4.75 27.649 4.75 28.1398 4.48083 28.4565L1.12417 31.8131L7.8375 29.5806L10.07 25.0998Z");
            canvas.FillPath(vector0path);
            canvas.RestoreState();


            // View:     frameView2
            // NodeName: map-marker 1
            // NodeType: FRAME
            // NodeId:   3:14
            canvas.SaveState();
            canvas.RestoreState();


            // View:     imageView2
            // NodeName: Vector
            // NodeType: VECTOR
            // NodeId:   3:15
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(255, 255, 255);
            canvas.Alpha = 1;
            canvas.Translate(168.91667f, 481.16666f);
            var vector1Builder = new PathBuilder();
            var vector1path = vector1Builder.BuildPath("M11.0833 15.0417C10.0335 15.0417 9.0267 14.6246 8.28437 13.8823C7.54204 13.14 7.125 12.1331 7.125 11.0833C7.125 10.0335 7.54204 9.0267 8.28437 8.28437C9.0267 7.54204 10.0335 7.125 11.0833 7.125C12.1331 7.125 13.14 7.54204 13.8823 8.28437C14.6246 9.0267 15.0417 10.0335 15.0417 11.0833C15.0417 11.6031 14.9393 12.1179 14.7404 12.5981C14.5414 13.0784 14.2499 13.5147 13.8823 13.8823C13.5147 14.2499 13.0784 14.5414 12.5981 14.7404C12.1179 14.9393 11.6031 15.0417 11.0833 15.0417ZM11.0833 0C8.14385 0 5.32476 1.1677 3.24623 3.24623C1.1677 5.32476 1.40628e-15 8.14385 0 11.0833C2.81256e-15 19.3958 11.0833 31.6667 11.0833 31.6667C11.0833 31.6667 22.1667 19.3958 22.1667 11.0833C22.1667 8.14385 20.999 5.32476 18.9204 3.24623C16.8419 1.1677 14.0228 2.10942e-15 11.0833 0Z");
            canvas.FillPath(vector1path);
            canvas.RestoreState();


            // View:     imageView3
            // NodeName: Vector
            // NodeType: VECTOR
            // NodeId:   3:17
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(255, 255, 255);
            canvas.Alpha = 1;
            canvas.Translate(167f, 291f);
            var vector2Builder = new PathBuilder();
            var vector2path = vector2Builder.BuildPath("M12.6667 0C14.3464 1.40628e-15 15.9573 0.66726 17.145 1.85499C18.3327 3.04272 19 4.65363 19 6.33333C19 8.01304 18.3327 9.62395 17.145 10.8117C15.9573 11.9994 14.3464 12.6667 12.6667 12.6667C10.987 12.6667 9.37605 11.9994 8.18832 10.8117C7.00059 9.62395 6.33333 8.01304 6.33333 6.33333C6.33333 4.65363 7.00059 3.04272 8.18832 1.85499C9.37605 0.66726 10.987 1.40628e-15 12.6667 0ZM12.6667 15.8333C19.665 15.8333 25.3333 18.6675 25.3333 22.1667L25.3333 25.3333L0 25.3333L0 22.1667C0 18.6675 5.66833 15.8333 12.6667 15.8333Z");
            canvas.FillPath(vector2path);
            canvas.RestoreState();


            // View:     imageView4
            // NodeName: Vector
            // NodeType: VECTOR
            // NodeId:   3:19
            canvas.SaveState();
            canvas.FillColor = Color.FromRgb(255, 255, 255);
            canvas.Alpha = 1;
            canvas.Translate(261f, 384f);
            var vector3Builder = new PathBuilder();
            var vector3path = vector3Builder.BuildPath("M28.5 0L20.5833 7.91667L20.5833 25.3333L28.5 18.2083L28.5 0ZM31.6667 6.33333L31.6667 27.7083C29.925 27.1542 28.025 26.9167 26.125 26.9167C23.4333 26.9167 19.5542 27.9458 17.4167 29.2917L17.4167 7.91667C15.1208 6.175 11.7958 5.54167 8.70833 5.54167C5.62083 5.54167 2.29583 6.175 0 7.91667L0 31.1125C0 31.5083 0.395833 31.9042 0.791667 31.9042C0.95 31.9042 1.02917 31.825 1.1875 31.825C3.325 30.7958 6.4125 30.0833 8.70833 30.0833C11.7958 30.0833 15.1208 30.7167 17.4167 32.4583C19.5542 31.1125 23.4333 30.0833 26.125 30.0833C28.7375 30.0833 31.4292 30.5583 33.6458 31.7458C33.8042 31.825 33.8833 31.825 34.0417 31.825C34.4375 31.825 34.8333 31.4292 34.8333 31.0333L34.8333 7.91667C33.8833 7.20417 32.8542 6.72917 31.6667 6.33333ZM14.25 27.5658C12.2708 27.0592 10.2917 26.9167 8.70833 26.9167C7.03 26.9167 5.035 27.2175 3.16667 27.7083L3.16667 9.70583C4.6075 9.0725 6.555 8.70833 8.70833 8.70833C10.8617 8.70833 12.8092 9.0725 14.25 9.70583L14.25 27.5658Z");
            canvas.FillPath(vector3path);
            canvas.RestoreState();
        }
    }
}

